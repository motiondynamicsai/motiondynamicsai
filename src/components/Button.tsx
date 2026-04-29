import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'gradient';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-secondary/90 text-black hover:bg-secondary shadow-[0_18px_50px_-42px_rgb(var(--md-secondary)_/_0.28)]',
  outline: 'border-2 border-secondary/25 text-secondary hover:bg-secondary/10',
  gradient: 'bg-blue-gradient text-black hover:shadow-lg',
};

const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => (
  <button
    className={`px-8 py-3 rounded-md font-medium transition-all duration-300 ${VARIANT_STYLES[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export { Button };
export default Button;
