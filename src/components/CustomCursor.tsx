import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check hover targets
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest('a, button, [data-cursor], input, textarea, [role="button"]');
      if (clickable) {
        setIsHovered(true);
        const customText = clickable.getAttribute('data-cursor');
        setCursorText(customText || '');
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Smooth lagging trailer position
  useEffect(() => {
    if (isTouchDevice) return;
    let animationFrameId: number;

    const updateTrailing = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
      }));
      animationFrameId = requestAnimationFrame(updateTrailing);
    };

    animationFrameId = requestAnimationFrame(updateTrailing);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Primary sharp center dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#F4E2D8] shadow-[0_0_8px_rgba(244,226,216,0.8)] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isMouseDown ? 0.6 : 1})`,
        }}
      />

      {/* Outer subtle follower ring */}
      <div
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border pointer-events-none transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isHovered
            ? 'w-10 h-10 border-[#E8C8B8]/70 bg-transparent shadow-[0_0_15px_rgba(194,45,67,0.25)]'
            : 'w-8 h-8 border-[#F4E2D8]/30 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) scale(${
            isMouseDown ? 0.85 : 1
          })`,
        }}
      >
        {isHovered && cursorText && (
          <span className="font-mono-tech text-[9px] font-bold tracking-widest uppercase text-center px-1 text-[#F4E2D8]">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};

