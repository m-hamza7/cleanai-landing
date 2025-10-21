import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const dimensions = {
    sm: { width: 120, height: 32 },
    md: { width: 150, height: 40 },
    lg: { width: 180, height: 48 }
  }

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo2.jpg"
        alt="CleanAI Logo"
        width={dimensions[size].width}
        height={dimensions[size].height}
        className={`${sizeClasses[size]} w-auto object-contain`}
        priority
      />
    </div>
  )
}
