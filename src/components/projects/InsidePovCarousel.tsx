"use client";

import React, {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./InsidePovCarousel.module.css";

type VideoItem = {
  src: string;
  poster?: string;
  alt?: string;
};

type InsidePovCarouselProps = {
  videos: VideoItem[];
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
  onSelectVideo?: (index: number) => void;
};

const AUTO_ROTATE_SPEED = 0.04;
const DRAG_SENSITIVITY = 0.28;
const INERTIA_FRICTION = 0.94;
const MIN_VELOCITY = 0.01;
const KEYBOARD_STEP = 8;

export default function InsidePovCarousel({
  videos,
  autoRotate = true,
  interactive = true,
  className,
  onSelectVideo,
}: InsidePovCarouselProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const rafRef = useRef<number | null>(null);

  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const mountedRef = useRef(false);

  const [isAutoEnabled, setIsAutoEnabled] = useState(autoRotate);
  const safeVideos = useMemo(() => videos.filter((video) => video.src), [videos]);
  const step = safeVideos.length > 0 ? 360 / safeVideos.length : 25.714285;

  const setRotation = useCallback((nextRotation: number) => {
    rotationRef.current = nextRotation;
    rootRef.current?.style.setProperty("--pov-rotation", `${nextRotation}deg`);
  }, []);

  const playVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Autoplay can be blocked by the browser. Ignore safely.
        });
      }
    });
  }, []);

  const pauseVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      video.pause();
    });
  }, []);

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

  useEffect(() => {
    if (safeVideos.length === 0) return;

    const tick = () => {
      const shouldAutoRotate =
        isAutoEnabled &&
        !prefersReducedMotionRef.current &&
        !isDraggingRef.current &&
        !isHoveredRef.current;

      let nextRotation = rotationRef.current;

      if (shouldAutoRotate) {
        nextRotation += AUTO_ROTATE_SPEED;
      }

      if (!isDraggingRef.current && Math.abs(velocityRef.current) > MIN_VELOCITY) {
        nextRotation += velocityRef.current;
        velocityRef.current *= INERTIA_FRICTION;
      }

      setRotation(nextRotation);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isAutoEnabled, safeVideos.length, setRotation]);

  useEffect(() => {
    if (safeVideos.length === 0) return;

    playVideos();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideos();
      } else {
        playVideos();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      pauseVideos();
    };
  }, [pauseVideos, playVideos, safeVideos.length]);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!interactive) return;

    isDraggingRef.current = true;
    lastXRef.current = event.clientX;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
    rootRef.current?.classList.add(styles.dragging);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!interactive || !isDraggingRef.current) return;

    const dx = event.clientX - lastXRef.current;
    dragDistanceRef.current += Math.abs(dx);
    const deltaDeg = dx * DRAG_SENSITIVITY;
    const nextRotation = rotationRef.current + deltaDeg;

    velocityRef.current = deltaDeg;
    lastXRef.current = event.clientX;
    setRotation(nextRotation);
  };

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (!interactive) return;

    isDraggingRef.current = false;
    rootRef.current?.classList.remove(styles.dragging);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
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
      setRotation(rotationRef.current - KEYBOARD_STEP);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      velocityRef.current = 0;
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
                if (dragDistanceRef.current < 6) {
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

export type { InsidePovCarouselProps, VideoItem };
