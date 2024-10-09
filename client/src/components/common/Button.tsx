import React from 'react';

interface ButtonProps {
    label?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    className = '',
    children,
    type = 'button',
    loading = false,
}) => {
    // Define variant styles
    const variantClasses = {
        primary: 'bg-teal-500 hover:bg-teal-600 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    };

    // Define size styles
    const sizeClasses = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-4 py-2 text-md',
        large: 'px-6 py-3 text-lg',
    };

    // Combine the classes for the button
    const buttonClasses = `
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    rounded 
    font-semibold 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    focus:ring-teal-400 
    disabled:opacity-50 
    disabled:cursor-not-allowed
    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {label || children}
        </button>
    );
};

export default Button;
