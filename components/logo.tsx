import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Icon/Symbol */}
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-green-500 rounded-lg flex items-center justify-center shadow-sm">
          {/* AI Circuit Pattern */}
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-0 left-1/2 w-px h-1 bg-white/60 transform -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-px h-1 bg-white/60 transform -translate-x-1/2"></div>
            <div className="absolute left-0 top-1/2 w-1 h-px bg-white/60 transform -translate-y-1/2"></div>
            <div className="absolute right-0 top-1/2 w-1 h-px bg-white/60 transform -translate-y-1/2"></div>
          </div>
        </div>
        {/* Small recycling indicator */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 border border-white rounded-full border-dashed"></div>
        </div>
      </div>
      
      {/* Text */}
      <div className={`font-bold ${sizeClasses[size]} text-foreground`}>
        <span className="text-primary">Clean</span>
        <span className="text-green-600">AI</span>
      </div>
    </div>
  )
}
