import React, { useEffect, useState } from "react";
import itlog from "../../assets/itlog ni joshua.jpg";
import burgir from "../../assets/burgir.jpg";
import lumpiangsariwa from "../../assets/lumpiang sariwa.jpg";

const FoodData = [
  {
    image: itlog,
    Name: "Itlog ni Joshua",
    desc: "Masarap kahit hindi pa luto",
  },
  { image: burgir, Name: "Burgir", desc: "Masarap kahit hindi pa luto" },
  {
    image: lumpiangsariwa,
    Name: "Lumpiang Sariwa",
    desc: "Masarap kahit hindi pa luto",
  },
];

const Topmenu = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const topMenuPosition = document.getElementById('topmenu').getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // Check if the Topmenu is within the viewport
    if (topMenuPosition < windowHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="topmenu" className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold mt-20 mb-5">Top Menu's</h1>
        <p className="text-xl mb-10">Our Top Menu's</p>
      </div>
      <div className="container py-1">
        {/* Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-8 mb-5">
          {FoodData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white/10 hover:scale-110 transition duration-300"
            >
              <img
                src={item.image}
                alt={item.Name}
                className="w-30 h-30 object-cover mx-auto rounded-full shadow-2xl transition-opacity duration-300"
              />
              <div className="flex items-center gap-2">
                <p className="text-3xl font-semibold mt-2">{item.Name}</p>
              </div>
              <div>
                <p className="text-xl">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topmenu;
