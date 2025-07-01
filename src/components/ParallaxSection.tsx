import React, { useRef, useEffect, useState } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offset?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = '',
  offset = 0
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const onScroll = () => setScrollY(window.scrollY);
    
    const onResize = () => {
      if (element) {
        setElementTop(element.offsetTop);
        setClientHeight(window.innerHeight);
      }
    };

    onScroll();
    onResize();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const isVisible = scrollY + clientHeight >= elementTop && scrollY <= elementTop + clientHeight;
  const parallaxOffset = isVisible ? (scrollY - elementTop) * speed + offset : 0;

  return (
    <div
      ref={elementRef}
      className={`parallax-section ${className}`}
      style={{
        transform: `translateY(${parallaxOffset}px)`,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxSection;