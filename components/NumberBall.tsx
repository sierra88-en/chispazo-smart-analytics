
import React from 'react';

interface Props {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'highlight' | 'low' | 'mid' | 'high';
}

const NumberBall: React.FC<Props> = ({ number, size = 'md', variant = 'default' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };

  const getVariantClasses = () => {
    if (number <= 9) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    if (number <= 19) return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      flex items-center justify-center rounded-full border-2 font-bold shadow-lg
      ${getVariantClasses()}
      transition-all duration-300 hover:scale-110 cursor-default
    `}>
      {number}
    </div>
  );
};

export default NumberBall;
