import { useState, useEffect } from 'react';

interface ScrollAnimationState {
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'none';
  isScrolling: boolean;
  scrollProgress: number;
}

export const useScrollAnimation = () => {
  const [scrollState, setScrollState] = useState<ScrollAnimationState>({
    scrollY: 0,
    scrollDirection: 'none',
    isScrolling: false,
    scrollProgress: 0
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0;
      
      const direction = currentScrollY > lastScrollY ? 'down' : 
                      currentScrollY < lastScrollY ? 'up' : 'none';

      setScrollState({
        scrollY: currentScrollY,
        scrollDirection: direction,
        isScrolling: true,
        scrollProgress: Math.min(100, Math.max(0, scrollProgress))
      });

      // Clear existing timeout
      clearTimeout(timeoutId);
      
      // Set new timeout to detect when scrolling stops
      timeoutId = setTimeout(() => {
        setScrollState(prev => ({
          ...prev,
          isScrolling: false,
          scrollDirection: 'none'
        }));
      }, 150);

      lastScrollY = currentScrollY;
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial call
    updateScrollState();

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return scrollState;
};

// Hook adicional para animações baseadas em scroll
export const useScrollTrigger = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScrollAnimation();

  useEffect(() => {
    const triggerPoint = window.innerHeight * threshold;
    setIsVisible(scrollY > triggerPoint);
  }, [scrollY, threshold]);

  return isVisible;
};

// Hook para parallax effect
export const useParallax = (speed: number = 0.5) => {
  const { scrollY } = useScrollAnimation();
  
  return {
    transform: `translateY(${scrollY * speed}px)`,
    willChange: 'transform'
  };
};