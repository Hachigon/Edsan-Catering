import React from 'react';

const FAQModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="animate-pop-up fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-10"> {/* Keeps the modal at the top center */}
      <div className="bg-white/90 rounded-lg shadow-lg p-5 w-11/12 md:w-1/3 relative mt-28"> {/* Increased margin-top for more spacing from the top */}
        {/* Close Button */}
        <button 
          className="absolute top-4 right-5 text-gray-500 hover:text-black" 
          onClick={onClose}>
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="mt-4">
          <h3 className="font-semibold">Q: What services do you offer?</h3>
          <p>A: We offer a variety of catering services for events of all sizes, including weddings, corporate events, and private parties.</p>
          <h3 className="font-semibold mt-2">Q: How can I place an order?</h3>
          <p>A: You can place an order through our website or by contacting us directly via phone or email.</p>
          <h3 className="font-semibold mt-2">Q: Do you accommodate dietary restrictions?</h3>
          <p>A: Yes, we offer vegetarian, vegan, gluten-free, and other specialized menu options upon request.</p>
          {/* Add more FAQs as needed */}
        </div>
      </div>
    </div>
  );
};

export default FAQModal;
