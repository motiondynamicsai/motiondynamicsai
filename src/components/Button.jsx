import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-secondary/90 text-black hover:bg-secondary shadow-[0_18px_50px_-42px_rgb(var(--md-secondary)_/_0.28)]',
    outline: 'border-2 border-secondary/25 text-secondary hover:bg-secondary/10',
    gradient: 'bg-blue-gradient text-black hover:shadow-lg'
  }

  return (
    <button
      className={`px-8 py-3 rounded-md font-medium transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'outline', 'gradient']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default Button
