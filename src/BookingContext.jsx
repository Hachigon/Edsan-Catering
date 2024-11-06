import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookedItems, setBookedItems] = useState([]);

  const addBookedItem = (item) => {
    setBookedItems((prevItems) => [...prevItems, item]);
  };

  return (
    <BookingContext.Provider value={{ bookedItems, addBookedItem }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
