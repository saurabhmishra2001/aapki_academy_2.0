import React from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                primary: "bg-blue-500 text-white hover:bg-blue-600",
                secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
                success: "bg-green-500 text-white hover:bg-green-600",
                error: "bg-red-500 text-white hover:bg-red-600",
                warning: "bg-yellow-500 text-yellow-900 hover:bg-yellow-600",
                info: "bg-sky-500 text-white hover:bg-sky-600",
                outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
                ghost: "hover:bg-gray-100 text-gray-700",
                link: "text-blue-500 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

const Button = React.forwardRef(
    ({ className, variant, size, children, ...props }, ref) => {
        const buttonClassName = buttonVariants({ variant, size, className });

        return (
            <button className={buttonClassName} ref={ref} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };