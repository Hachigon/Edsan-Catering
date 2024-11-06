import React, { useEffect, useState } from 'react';
import { db } from "../../FirebaseConfig"; 
import { collection, query, where, onSnapshot, addDoc, getDocs } from "firebase/firestore"; 
import MenuImage from "../../assets/EdsanFood.jpg";
import chicken from "../../assets/Chicken.jpg";
import fish from "../../assets/Fish.jpg";
import vegetables from "../../assets/Vegetables.jpg";
import pork from "../../assets/Pork.jpg";
import beef from "../../assets/Beef.jpg";
import itlog from '../../assets/itlog ni joshua.jpg';
import { useAuth } from '../../AuthContext'; 

const Menu = () => {
    const FoodData = [
        { image: itlog, name: "All Items", category: "All Items" },
        { image: chicken, name: "Chicken", category: "Chicken" },
        { image: fish, name: "Fish", category: "Fish" },
        { image: vegetables, name: "Vegetables", category: "Vegetables" },
        { image: pork, name: "Pork", category: "Pork" },
        { image: beef, name: "Beef", category: "Beef" }
    ];

    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Items");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userBookings, setUserBookings] = useState([]);
    const { isLoggedIn, user } = useAuth(); 

    const fetchMenuItems = () => {
        const availableProductsQuery = query(
            collection(db, "products"),
            where("available", "==", true)
        );

        onSnapshot(availableProductsQuery, (querySnapshot) => {
            const items = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMenuItems(items);
        }, (error) => {
            console.error("Error fetching menu items: ", error);
        });
    };

    const fetchUserBookings = () => {
        if (!user) return; // Exit if user is not logged in
        const bookingsQuery = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid)
        );

        onSnapshot(bookingsQuery, (querySnapshot) => {
            const bookings = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserBookings(bookings);
        }, (error) => {
            console.error("Error fetching user bookings: ", error);
        });
    };

    useEffect(() => {
        fetchMenuItems();
        fetchUserBookings();
    }, [user]); // Fetch bookings when user changes

    const handleImageClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleOrder = () => {
        if (!isLoggedIn) {
            alert("YOU NEED TO LOG IN TO ORDER.");
            return;
        }
        // Proceed with order logic
    };  

    const handleBooking = async () => {
        if (!isLoggedIn) {
            alert("YOU NEED TO LOG IN TO BOOK.");
            closeModal();
            return;
        }
        if (!user) {
            alert("User information is not available.");
            return;
        }
    
        try {
            // Check if the item has already been booked by the user
            const bookingsRef = collection(db, "bookings");
            const q = query(
                bookingsRef,
                where("userId", "==", user.uid),
                where("itemId", "==", selectedItem.id)
            );
    
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                alert("ITEM ALREADY BOOKED. ");
                closeModal();
                return; // Exit function if the item is already booked
            }
    
            // If the item is not already booked, proceed with booking
            await addDoc(bookingsRef, {
                itemId: selectedItem.id,
                itemName: selectedItem.name,
                itemPrice: selectedItem.price,
                itemImage: selectedItem.image,
                userId: user.uid,
                timestamp: new Date()
            });
    
            alert("ITEM ADDED TO BOOKING!");
            closeModal();
        } catch (error) {
            console.error("Error adding booking: ", error);
            alert("Failed to add item to booking.");
        }
    };
    
    
    const filteredMenuItems = selectedCategory === "All Items" 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);

    return (
        <div>
            <img className="w-full mb-5" src={MenuImage} alt="Menu Banner" />
            <h1 className="text-3xl font-semibold text-center mt-16">Menu</h1>
            <p className="text-xl text-center mt-5">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatum qui labore laborum obcaecati sequi, 
                consequatur a nisi hic beatae accusamus commodi placeat libero officia, reiciendis exercitationem soluta 
                optio, velit dolore?
            </p>

            <div className="flex overflow-x-auto space-x-10 p-5 mt-10 scrollbar-hide">
                {FoodData.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedCategory(item.category)} 
                        className={`flex flex-col items-center gap-3 min-w-[300px] p-4 rounded-3xl bg-white/10 hover:scale-110 transition duration-300 ${selectedCategory === item.category ? 'bg-blue-500' : ''}`}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-30 h-30 object-cover mx-auto rounded-full shadow-2xl transition-opacity duration-300"
                        />
                        <p className="text-3xl font-semibold mt-2">{item.name}</p>
                    </button>
                ))}
            </div>

            <div className="menu-container justify-center items-center p-5 mt-5 h-96 overflow-y-auto scrollbar-hide">
                {filteredMenuItems.length === 0 ? ( 
                    <p className="text-center">No products available.</p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredMenuItems.map((item) => (
                            <li key={item.id} onClick={() => handleImageClick(item)} className="p-7 hover:scale-110 transition duration-300 bg-white/10 rounded-3xl cursor-pointer">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                                />
                                <h3 className="font-semibold text-center">{item.name}</h3>
                                <p className="text-center">₱{item.price}</p>
                                <p className="text-center">Category: {item.category}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 flex justify-center items-center p-5 bg-black bg-opacity-75 z-50">
                    <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 p-8">
                        <button onClick={closeModal} className="absolute top-3 right-4 text-gray-700 hover:text-black transition duration-200">
                            X
                        </button>
                        <img src={selectedItem.image} alt={selectedItem.name} className="w-52 h-52 mx-auto rounded-full border-4 border-blue-950 shadow-md mb-4" />
                        <h2 className="text-3xl font-semibold text-center mb-2">{selectedItem.name}</h2>
                        <p className="text-center text-2xl font-bold text-blue-950 mb-2">₱{selectedItem.price}</p>
                        <p className="text-center text-lg mb-4 text-gray-600">Category: {selectedItem.category}</p>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button 
                                onClick={handleOrder} 
                                className="bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-3 rounded-lg shadow-md transform hover:scale-105 duration-200"
                            >
                                Order Now
                            </button>
                            <button 
                                onClick={handleBooking} 
                                className="bg-green-600 hover:bg-green-500 transition text-white px-6 py-3 rounded-lg shadow-md transform hover:scale-105 duration-200"
                            >
                                Add to Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
