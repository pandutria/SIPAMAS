import logo from "/image/logo/logo-monalisa.png";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  text?: string;
}

export default function LoadingSpinner({ fullScreen = true, text = "Memuat..." }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" />
        
        <div className="absolute inset-4 rounded-full flex items-center justify-center bg-white shadow-lg">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        </div>
      </div>

      <div className="text-center">
        <p className="font-poppins-medium text-gray-700 text-sm">
          {text}
        </p>
        <div className="flex justify-center gap-1 mt-3">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-96">
      {content}
    </div>
  );
}