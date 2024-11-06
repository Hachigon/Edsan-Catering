import React, { useEffect, useState } from 'react';
import BannerImage from '../../assets/Food1.jpg';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const bannerPosition = document.getElementById('banner').getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // Check if the banner is within the viewport
    if (bannerPosition < windowHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="banner" className={`py-10 mt-10 fade-in ${isVisible ? 'visible' : ''}`}>
      <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[600px] md:p-0 pb-10 gap-8">
        {/* Image Section */}
        <div className="flex justify-center md:ml-5">
          <img className="animate-spin-slow rounded-full shadow-lg mb-16" src={BannerImage} alt="" />
        </div>
        {/* Text Section */}
        <div className="flex flex-col justify-center text-startr">
          <h1 className="text-5xl font-semibold">
            Masarap na Pagkain Andito na.
          </h1>
          <p className="py-5 text-2xl md:text-left">
            Every dish we serve at Edsan Catering reflects our love for fine dining and our dedication to quality, so your guests will not only enjoy the flavors but also the moments they spend together, making memories that will last beyond the table. We are committed to turning your events into extraordinary experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
