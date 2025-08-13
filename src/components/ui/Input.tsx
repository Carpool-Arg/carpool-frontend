import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, rightIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    return (
      <div className="flex flex-col relative">
        {label && (
          <label className="mb-1 text-dark-4 dark:text-gray-1 font-regular font-inter text-sm">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            disabled={props.disabled}
            className={`w-full rounded-md px-3 py-2 
              ${isPassword ? 'pr-10' : rightIcon ? 'pr-10' : 'pr-3'}
              ${error ? 'border-red-500' : ''}
              ${props.disabled ? 'bg-gray-100 dark:bg-gray-2 dark:text-gray-3 cursor-not-allowed' : 'border border-gray-300 dark:bg-background dark:border-gray-2 dark:placeholder-gray-400 dark:text-white'}
              ${className ?? ''}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'