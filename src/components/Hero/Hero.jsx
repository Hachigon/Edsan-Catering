import React from 'react'
import { useNavigate } from 'react-router-dom'
import Image from '../../assets/Food1.jpg'

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div>
        <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[600px] gap-8">
            {/* Text Section */}
            <div className="flex flex-col justify-center gap-5 text-center md:text-left pt-24 md:p-0 pb-10 md:ml-5">
                <h1 className="text-5xl font-semibold">
                    Mura, Masarap, Madaling Kausap.      
                </h1>
                <p className="text-2xl">
                    Let Edsan Catering Take You on a Flavor Journey: Crafting Delicious Memories for Every Celebration!
                </p>
                <div className="flex gap-4 justify-center items-center md:justify-start">
                    <button 
                        className="primary-btn hover:scale-110 transition duration-300 shadow-2xl"
                        onClick={() => navigate('/menu')}
                    >
                        Food Menu
                    </button>
                </div>
            </div>
            {/* Image Section */}
            <div className="flex justify-center md:mr-5">
                <img className="animate-spin-slow rounded-full shadow-2xl" 
                src={Image} alt=""/>
            </div>
        </div>
    </div>
  )
}

export default Hero
