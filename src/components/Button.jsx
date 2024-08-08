import React from 'react'

const Button = ({styles}) => {
  return (
    <button type="button" className= {`py-6 px-8 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none ${styles}`}>
      Demo experience
    </button>
  )
}

export default Button
