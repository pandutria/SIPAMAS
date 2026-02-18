import { useEffect, useState } from 'react';
import logo from "/image/logo/logo-sipamas.png";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-linear-to-br from-third to-secondary 
                  flex flex-col items-center justify-center z-9999 overflow-hidden
                  transition-all duration-1000 ease-in-out origin-top
                  ${isAnimatingOut ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}
      aria-live="polite"
      role="status"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/3 -left-1/4 w-2/3 h-2/3 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute top-1/4 left-1/3 w-1/3 h-1/3 bg-white/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '350ms' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 bg-white/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      </div>

      <div className={`relative z-10 flex flex-col items-center px-6 transition-all duration-700 ease-out
                       ${isAnimatingOut ? '-translate-y-12.5 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="relative animate-[fadeInUp_0.8s_ease-out]">
          <div className="absolute -inset-6 bg-linear-to-r from-third/40 to-third/40 rounded-3xl blur-2xl animate-pulse"></div>
          
          <div className="relative bg-white/15 backdrop-blur-md rounded-2xl p-4 shadow-2xl shadow-secondary-900/40 border border-white/30">
            <div className="bg-white rounded-xl p-8 animate-[logoFloat_3s_ease-in-out_infinite]">
              <img 
                src={logo} 
                alt="Monalisa Logo" 
                className="w-36 h-36 md:w-48 md:h-48 object-contain drop-shadow-2xl animate-[logoPop_0.6s_ease-out]"
                loading="eager"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 text-center animate-[fadeInUp_1s_ease-out_0.3s_both]">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            SIPAMAS
          </h1>
          <p className="mt-4 text-lg md:text-xl text-amber-50/95 font-medium max-w-md tracking-wide">
            Sistem Pelaporan Masyarakat
          </p>
        </div>

        <div className="mt-12 flex items-center gap-3 animate-[fadeInUp_1s_ease-out_0.5s_both]">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-bounce shadow-lg shadow-white/50"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '1s' }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-8 left-8 w-28 h-28 border-t-2 border-l-2 border-white/40 rounded-tl-2xl animate-[borderExpand_1.5s_ease-out]"></div>
      <div className="absolute top-8 right-8 w-28 h-28 border-t-2 border-r-2 border-white/40 rounded-tr-2xl animate-[borderExpand_1.5s_ease-out_0.1s_both]"></div>
      <div className="absolute bottom-8 left-8 w-28 h-28 border-b-2 border-l-2 border-white/40 rounded-bl-2xl animate-[borderExpand_1.5s_ease-out_0.2s_both]"></div>
      <div className="absolute bottom-8 right-8 w-28 h-28 border-b-2 border-r-2 border-white/40 rounded-br-2xl animate-[borderExpand_1.5s_ease-out_0.3s_both]"></div>
    </div>
  );
}