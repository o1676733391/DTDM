import React from 'react'
import Title from './Title'
import { testimonials, assets } from '../assets/assets'
import StarRating from './StarRating'

const Star = ({ filled }) => (
    <img 
        src={filled ? assets.starIconFilled : assets.starIconOutlined} 
        alt="star" 
        className="w-4 h-4"
    />
)

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center px-5 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30'>
        <Title title='What Our Guests Say' subTitle='Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world.'/>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 w-full">
            {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <img className="w-12 h-12 rounded-full object-cover" src={testimonial.image} alt={testimonial.name}/>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-base">{testimonial.name}</h3>
                            <p className="text-gray-500 text-sm">{testimonial.address}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mb-4">
                        {Array(5).fill(0).map((_, index) => (
                            <Star key={index} filled={testimonial.rating > index} />
                        ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{testimonial.review}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Testimonial