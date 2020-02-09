import React, { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

type Size = 'small' | 'medium';
type Variant = 'solid' | 'ghost' | 'ghost-danger';

const sizes = {
  small: 'px-2 py-2 text-sm',
  medium: 'px-4 md:px-5 xl:px-4 py-3 md:py-4 xl:py-3 md:text-lg',
};

const variants = {
  solid: 'bg-pink-500 hover:bg-pink-600 shadow-md',
  ghost:
    'bg-transparent rounded text-pink-500 hover:bg-pink-500 hover:text-white',
  'ghost-danger':
    'bg-transparent rounded text-red-500 hover:bg-red-500 hover:text-white',
};

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: Size;
  variant?: Variant;
}

const Button = ({
  className,
  size = 'medium',
  variant = 'solid',
  ...props
}: ButtonProps) => (
  <button
    className={classNames(
      `transition-all
      rounded-lg
      text-white
      xl:text-base
      font-semibold
      leading-tight
      cursor-pointer`,
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  />
);

export default Button;