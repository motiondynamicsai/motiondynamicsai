import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-secondary text-primary hover:bg-opacity-90',
    outline: 'border-2 border-secondary text-secondary hover:bg-secondary hover:bg-opacity-10',
    gradient: 'bg-blue-gradient text-primary hover:shadow-lg'
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
