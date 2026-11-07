"use client";

import React, {
  type KeyboardEvent,
  type PointerEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./InsidePovCarousel.module.css";

export type VideoItem = {
  src: string;
  poster?: string;
  alt?: string;
};

export type InsidePovCarouselHandle = {
  rotatePrev: () => void;
  rotateNext: () => void;
  toggleAutoRotate: () => void;
  getCurrentIndex: () => number;
};

export type InsidePovCarouselProps = {
  videos: VideoItem[];
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
  onSelectVideo?: (index: number) => void;
  onActiveIndexChange?: (index: number) => void;
};

const AUTO_ROTATE_SPEED = 0.04;
const DRAG_SENSITIVITY = 0.28;
const DRAG_SENSITIVITY_MOBILE = 0.38;
const INERTIA_FRICTION = 0.94;
const MIN_VELOCITY = 0.01;
const MAX_VELOCITY = 4.0;
const KEYBOARD_STEP = 8;

const InsidePovCarousel = forwardRef<InsidePovCarouselHandle, InsidePovCarouselProps>(
  function InsidePovCarousel(
    {
      videos,
      autoRotate = true,
      interactive = true,
      className,
      onSelectVideo,
      onActiveIndexChange,
    },
    ref
  ) {
    const rootRef = useRef<HTMLElement | null>(null);
    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const rafRef = useRef<number | null>(null);

    const rotationRef = useRef(0);
    const velocityRef = useRef(0);
    const targetRotationRef = useRef<number | null>(null);
    const lastCheckedRotationRef = useRef(0);

    // Pointer gesture & directional tracking for mobile
    const pointerIdRef = useRef<number | null>(null);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const lastXRef = useRef(0);
    const dragDistanceRef = useRef(0);
    const isDraggingRef = useRef(false);
    const hasCapturedRef = useRef(false);
    const isVerticalScrollRef = useRef(false);
    const directionLockedRef = useRef(false);

    const isHoveredRef = useRef(false);
    const prefersReducedMotionRef = useRef(false);
    const mountedRef = useRef(false);
    const activeFrontIndexRef = useRef(0);

    const [isAutoEnabled, setIsAutoEnabled] = useState(autoRotate);
    const safeVideos = useMemo(() => videos.filter((video) => video.src), [videos]);
    const step = safeVideos.length > 0 ? 360 / safeVideos.length : 25.714285;

    const setRotation = useCallback((nextRotation: number) => {
      rotationRef.current = nextRotation;
      rootRef.current?.style.setProperty("--pov-rotation", `${nextRotation}deg`);
    }, []);

    // Helper: calculate front-most card index
    const calcFrontIndex = useCallback(
      (rot: number) => {
        if (safeVideos.length === 0) return 0;
        const raw = Math.round(-rot / step);
        return ((raw % safeVideos.length) + safeVideos.length) % safeVideos.length;
      },
      [safeVideos.length, step]
    );

    // Smart video playback: only play cards within front-facing arc (+/- 68 deg)
    // Pauses rear-facing cards on mobile to prevent WebKit multi-video decoder throttling
    const updateVideoPlayStates = useCallback(
      (currentRotation: number, forceAll = false) => {
        if (safeVideos.length === 0) return;

        safeVideos.forEach((_, index) => {
          const video = videoRefs.current[index];
          if (!video) return;

          if (forceAll) {
            const p = video.play();
            if (p) p.catch(() => {});
            return;
          }

          const cardAngle = index * step + currentRotation;
          const normalizedAngle = (((cardAngle % 360) + 540) % 360) - 180;
          const isFrontFacing = Math.abs(normalizedAngle) <= 68;

          if (isFrontFacing) {
            if (video.paused) {
              const p = video.play();
              if (p) p.catch(() => {});
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      [safeVideos, step]
    );

    const pauseAllVideos = useCallback(() => {
      videoRefs.current.forEach((video) => {
        if (!video) return;
        video.pause();
      });
    }, []);

    // Imperative ref methods for external navigation controls (mobile thumb buttons)
    useImperativeHandle(
      ref,
      () => ({
        rotatePrev: () => {
          if (safeVideos.length === 0) return;
          const current = rotationRef.current;
          const target = Math.round((current + step) / step) * step;
          targetRotationRef.current = target;
          velocityRef.current = 0;
        },
        rotateNext: () => {
          if (safeVideos.length === 0) return;
          const current = rotationRef.current;
          const target = Math.round((current - step) / step) * step;
          targetRotationRef.current = target;
          velocityRef.current = 0;
        },
        toggleAutoRotate: () => {
          setIsAutoEnabled((curr) => !curr);
        },
        getCurrentIndex: () => activeFrontIndexRef.current,
      }),
      [safeVideos.length, step]
    );

    useEffect(() => {
      mountedRef.current = true;
      const root = rootRef.current;
      if (!root) return;

      root.style.setProperty("--pov-step", `${step}deg`);
      root.style.setProperty("--pov-rotation", `${rotationRef.current}deg`);

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReducedMotionRef.current = mediaQuery.matches;

      const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
        prefersReducedMotionRef.current = event.matches;
      };

      mediaQuery.addEventListener("change", handleMotionPreferenceChange);

      return () => {
        mountedRef.current = false;
        mediaQuery.removeEventListener("change", handleMotionPreferenceChange);
      };
    }, [step]);

    useEffect(() => {
      setIsAutoEnabled(autoRotate);
    }, [autoRotate]);

    // Main animation loop with smooth inertia and snap interpolation
    useEffect(() => {
      if (safeVideos.length === 0) return;

      const tick = () => {
        const shouldAutoRotate =
          isAutoEnabled &&
          !prefersReducedMotionRef.current &&
          !isDraggingRef.current &&
          !isHoveredRef.current &&
          targetRotationRef.current === null;

        let nextRotation = rotationRef.current;

        // 1. Smooth snap to target (when user clicks prev/next buttons)
        if (targetRotationRef.current !== null) {
          const diff = targetRotationRef.current - rotationRef.current;
          if (Math.abs(diff) < 0.1) {
            nextRotation = targetRotationRef.current;
            targetRotationRef.current = null;
          } else {
            nextRotation = rotationRef.current + diff * 0.2;
          }
        } else if (shouldAutoRotate) {
          nextRotation += AUTO_ROTATE_SPEED;
        } else if (!isDraggingRef.current && Math.abs(velocityRef.current) > MIN_VELOCITY) {
          nextRotation += velocityRef.current;
          velocityRef.current *= INERTIA_FRICTION;
        }

        setRotation(nextRotation);

        // Check front card index change
        const frontIdx = calcFrontIndex(nextRotation);
        if (frontIdx !== activeFrontIndexRef.current) {
          activeFrontIndexRef.current = frontIdx;
          onActiveIndexChange?.(frontIdx);
        }

        // Throttle video play/pause updates (every ~5 degrees of rotation)
        if (Math.abs(nextRotation - lastCheckedRotationRef.current) > 5) {
          lastCheckedRotationRef.current = nextRotation;
          updateVideoPlayStates(nextRotation);
        }

        rafRef.current = window.requestAnimationFrame(tick);
      };

      rafRef.current = window.requestAnimationFrame(tick);

      return () => {
        if (rafRef.current !== null) {
          window.cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    }, [
      isAutoEnabled,
      safeVideos.length,
      setRotation,
      calcFrontIndex,
      onActiveIndexChange,
      updateVideoPlayStates,
    ]);

    // Handle document visibility (pause when tab hidden, resume when visible)
    useEffect(() => {
      if (safeVideos.length === 0) return;

      updateVideoPlayStates(rotationRef.current);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          pauseAllVideos();
        } else {
          updateVideoPlayStates(rotationRef.current);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        pauseAllVideos();
      };
    }, [pauseAllVideos, safeVideos.length, updateVideoPlayStates]);

    // ── GESTURE DETECTION (DIRECTION-AWARE TOUCH HANDLING) ──
    const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
      if (!interactive) return;

      if (event.isPrimary === false || (event.pointerType === "mouse" && event.button !== 0)) {
        return;
      }

      pointerIdRef.current = event.pointerId;
      startXRef.current = event.clientX;
      startYRef.current = event.clientY;
      lastXRef.current = event.clientX;
      dragDistanceRef.current = 0;
      velocityRef.current = 0;
      targetRotationRef.current = null; // Cancel any active snap animation

      isDraggingRef.current = false;
      hasCapturedRef.current = false;
      isVerticalScrollRef.current = false;
      directionLockedRef.current = false;

      // Mouse drag starts immediately
      if (event.pointerType === "mouse") {
        isDraggingRef.current = true;
        hasCapturedRef.current = true;
        directionLockedRef.current = true;
        rootRef.current?.classList.add(styles.dragging);
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Ignore if pointer capture fails
        }
      }
    };

    const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
      if (!interactive || pointerIdRef.current !== event.pointerId) return;

      const dx = event.clientX - startXRef.current;
      const dy = event.clientY - startYRef.current;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Determine user intent if not yet locked
      if (!directionLockedRef.current) {
        if (absDx > 6 || absDy > 6) {
          if (absDy > absDx) {
            // User intends to scroll the page vertically!
            // Do NOT capture pointer; allow browser to handle native page scroll smoothly.
            isVerticalScrollRef.current = true;
            directionLockedRef.current = true;
            return;
          } else {
            // User intends to rotate the carousel horizontally!
            isDraggingRef.current = true;
            directionLockedRef.current = true;
            hasCapturedRef.current = true;
            rootRef.current?.classList.add(styles.dragging);
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // Ignore if pointer capture fails
            }
          }
        } else {
          return;
        }
      }

      // If vertical scroll was chosen, do not interfere
      if (isVerticalScrollRef.current || !isDraggingRef.current) return;

      const stepDx = event.clientX - lastXRef.current;
      dragDistanceRef.current += Math.abs(stepDx);

      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      const sensitivity = isMobile ? DRAG_SENSITIVITY_MOBILE : DRAG_SENSITIVITY;
      const deltaDeg = stepDx * sensitivity;

      velocityRef.current = deltaDeg;
      lastXRef.current = event.clientX;
      setRotation(rotationRef.current + deltaDeg);
    };

    const endDrag = (event: PointerEvent<HTMLElement>) => {
      if (!interactive || pointerIdRef.current !== event.pointerId) return;

      pointerIdRef.current = null;
      const wasDragging = isDraggingRef.current;
      isDraggingRef.current = false;
      directionLockedRef.current = false;
      isVerticalScrollRef.current = false;

      rootRef.current?.classList.remove(styles.dragging);

      if (hasCapturedRef.current && event.currentTarget.hasPointerCapture(event.pointerId)) {
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore
        }
      }
      hasCapturedRef.current = false;

      if (wasDragging) {
        // Clamp throw velocity for a pleasant natural glide
        velocityRef.current = Math.max(
          -MAX_VELOCITY,
          Math.min(MAX_VELOCITY, velocityRef.current)
        );
      }
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      rootRef.current?.classList.add(styles.paused);
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      rootRef.current?.classList.remove(styles.paused);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (!interactive) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        velocityRef.current = 0;
        targetRotationRef.current = null;
        setRotation(rotationRef.current - KEYBOARD_STEP);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        velocityRef.current = 0;
        targetRotationRef.current = null;
        setRotation(rotationRef.current + KEYBOARD_STEP);
      }

      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        setIsAutoEnabled((current) => !current);
      }
    };

    const carouselClassName = [
      styles.carousel,
      !interactive ? styles.paused : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    if (safeVideos.length === 0) {
      return null;
    }

    return (
      <section
        ref={rootRef}
        className={carouselClassName}
        tabIndex={interactive ? 0 : -1}
        aria-roledescription="3D video carousel"
        onPointerDown={interactive ? handlePointerDown : undefined}
        onPointerMove={interactive ? handlePointerMove : undefined}
        onPointerUp={interactive ? endDrag : undefined}
        onPointerCancel={interactive ? endDrag : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.stage}>
          <div className={styles.world}>
            {safeVideos.map((video, index) => (
              <figure
                key={`${video.src}-${index}`}
                className={styles.card}
                style={{ "--i": index } as React.CSSProperties}
                onClick={() => {
                  if (dragDistanceRef.current < 8 && !isVerticalScrollRef.current) {
                    onSelectVideo?.(index);
                  }
                }}
              >
                <video
                  ref={(node) => {
                    if (node) videoRefs.current[index] = node;
                  }}
                  className={styles.video}
                  src={video.src}
                  poster={video.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={video.alt}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default InsidePovCarousel;