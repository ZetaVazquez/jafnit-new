import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 600,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const getAnimationClasses = () => {
    const baseClasses = `transition-all duration-700 ease-out`;
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${baseClasses} translate-y-8 opacity-0`;
        case 'down':
          return `${baseClasses} -translate-y-8 opacity-0`;
        case 'left':
          return `${baseClasses} translate-x-8 opacity-0`;
        case 'right':
          return `${baseClasses} -translate-x-8 opacity-0`;
        default:
          return `${baseClasses} translate-y-8 opacity-0`;
      }
    } else {
      return `${baseClasses} translate-y-0 translate-x-0 opacity-100`;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(getAnimationClasses(), className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};