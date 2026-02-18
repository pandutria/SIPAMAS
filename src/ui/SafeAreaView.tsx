import type React from "react";

interface SafeAreaViewProps {
    children: React.ReactNode;
    className?: string;
}

export default function SafeAreaView({ children, className }: SafeAreaViewProps) {
  return (
    <div className="w-full h-auto py-12">
      <div className={`lg:w-300 w-auto mx-auto h-full flex gap-6 justify-between items-center lg:px-0 px-6 ${className}`}>
        {children}
      </div>
    </div>
  )
}
