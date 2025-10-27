import React from 'react'

const Title = ({ title, subTitle, align = "center" }) => {
  return (
    <div className={align === "left" ? 'text-left' : 'text-center'}>
      <h2 className='font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
        {title}
      </h2>
      <p className={`text-gray-600 text-base leading-relaxed ${align === "left" ? '' : 'max-w-4xl mx-auto'}`}>
        {subTitle}
      </p>
    </div>
  )
}

export default Title;
