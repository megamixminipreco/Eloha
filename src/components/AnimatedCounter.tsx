import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  target?: number;
  targetDate?: string;
  duration?: number;
  suffix?: string;
  className?: string;
  delay?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  targetDate,
  duration = 2000,
  suffix = '',
  className = '',
  delay = 0
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Countdown logic for target date
  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetTime = new Date(targetDate).getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Number animation logic for target number
  useEffect(() => {
    if (!isVisible || !target) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOutCubic * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration, isVisible]);

  // If targetDate is provided, show countdown
  if (targetDate) {
    return (
      <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${className}`}>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/30 mb-6">
          <h4 className="text-white font-bold text-lg mb-4 text-center flex items-center justify-center gap-2">
            ⏰ Contagem Regressiva Real
          </h4>
          
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-cyan-300 number-glow">
                {timeLeft.days}
              </div>
              <div className="text-xs text-cyan-200 font-medium">Dias</div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-blue-300 number-glow">
                {timeLeft.hours}
              </div>
              <div className="text-xs text-cyan-200 font-medium">Horas</div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-purple-300 number-glow">
                {timeLeft.minutes}
              </div>
              <div className="text-xs text-cyan-200 font-medium">Min</div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-pink-300 number-glow animate-pulse">
                {timeLeft.seconds}
              </div>
              <div className="text-xs text-cyan-200 font-medium">Seg</div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-cyan-200 text-sm italic">
              "A magia está chegando!" ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If target number is provided, show animated counter
  return (
    <span className={`inline-block transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${className}`}>
      {count}{suffix}
    </span>
  );
};

export default AnimatedCounter;