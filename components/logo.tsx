'use client'

import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const dimensions = {
    sm: { width: 450, height: 70 },
    md: { width: 350, height: 100 },
    lg: { width
      : 400, height: 120 }
  }

  const sizeClasses = {
    sm: 'h-20',
    md: 'h-25',
    lg: 'h-30'
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
