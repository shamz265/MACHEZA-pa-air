import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden p-0.5 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-lg shadow-black/40 flex items-center justify-center shrink-0 group`}
      >
        <img
          src="/src/assets/images/macheza_pa_air_logo_1792085876828.jpg"
          alt="Macheza Pa Air"
          className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-white leading-tight uppercase font-sans">
              Macheza Pa Air
            </span>
          </div>
          <span className="text-[10px] font-semibold text-rose-400 tracking-wider uppercase">
            Malawi Connect & Calls
          </span>
        </div>
      )}
    </div>
  );
};
