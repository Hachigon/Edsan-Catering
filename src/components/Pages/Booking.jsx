import React, { useEffect, useState } from 'react';
import { db } from '../../FirebaseConfig';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';

const Booking = () => {
  const [bookedItems, setBookedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const MAX_QUANTITY = 10;

  const fetchBookedItems = () => {
    const bookedItemsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    onSnapshot(bookedItemsQuery, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Booked items:", items);
      setBookedItems(items);
    }, (error) => {
      console.error("Error fetching booked items: ", error);
    });
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const itemRef = doc(db, "bookings", itemId);
    await updateDoc(itemRef, { quantity: newQuantity });
  };

  const handleIncrement = (item) => {
    const newQuantity = item.quantity ? item.quantity + 1 : 1;
    if (newQuantity <= MAX_QUANTITY) {
      updateQuantity(item.id, newQuantity);
    } else {
      alert(`MAXIMUM QUANTITY OF ${MAX_QUANTITY} REACHED FOR ${item.itemName}.`);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async (itemId) => {
    const confirmRemove = window.confirm("ARE YOU SURE YOU WANT TO REMOVE THIS ITEM FROM YOUR BOOKING?");
    if (confirmRemove) {
      const itemRef = doc(db, "bookings", itemId);
      await deleteDoc(itemRef);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookedItems();
    }
  }, [user]);

  const filteredItems = bookedItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative h-screen">
      <h1 className="text-3xl font-semibold text-center pt-10 pb-5">
        Booked Items
      </h1>

      {/* Responsive Search Bar */}
      <div className="flex justify-center mb-4">
        <div className="relative w-full max-w-md px-3">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
          )}
        </div>
      </div>

      <div className="p-5 h-128 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <p className="text-center">No booked items.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const totalPrice = (item.itemPrice * (item.quantity || 1)).toFixed(2);

              return (
                <li key={item.id} className="p-7 bg-white/10 rounded-3xl shadow-lg">
                  <img src={item.itemImage} alt={item.itemName} className="w-32 h-32 object-cover rounded-full mx-auto shadow-xl" />
                  <h3 className="font-semibold text-center">{item.itemName}</h3>
                  <p className="text-center">₱{totalPrice}</p>
                  <p className="text-center">Booked on: {item.timestamp ? item.timestamp.toDate().toLocaleDateString() : 'Loading...'}</p>
                  
                  <div className="flex items-center justify-center mt-4">
                    <button 
                      onClick={() => handleDecrement(item)} 
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:scale-110 transition duration-300"
                    >
                      -
                    </button>
                    <span className="mx-4 text-lg">{item.quantity || 1}</span>
                    <button 
                      onClick={() => handleIncrement(item)} 
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:scale-110 transition duration-300"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => handleRemove(item.id)} 
                    className="mt-4 w-full py-2 bg-blue-950 text-white rounded-md"
                  >
                    Remove from Booking
                  </button>
                </li>
              );
            })} 
          </ul> 
        )}
      </div>

      {/* Book Button */}
      <button 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        onClick={() => alert("Booking action triggered")}
      >
        BOOK
      </button>
    </div>
  );
};

export default Booking;
