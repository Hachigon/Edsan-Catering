import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Topmenu from './components/TopMenu/Topmenu';
import Banner from './components/Banner/Banner';
import Footer from './components/Footer/Footer';
import Menu from './components/Pages/Menu';
import NotFound from './components/Pages/NotFound';
import FAQ from './assets/faq.png';
import BgImage from './assets/EdsanCatering.jpg';
import Profile from './components/Pages/Profile';
import AccountSettings from './components/Pages/AccountSettings';
import Notification from './components/Pages/Notification';
import Booking from './components/Pages/Booking';
import { AuthProvider, useAuth } from './AuthContext';
import { BookingProvider } from './BookingContext';
import { useLocation } from 'react-router-dom';
import FAQModal from './FAQ'; // Import your FAQModal component

const bgStyle = {
  backgroundImage: `url(${BgImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

const FAQButton = ({ onClick }) => {
  const location = useLocation();
  const showFAQButton = location.pathname === '/' || location.pathname === '/menu';

  return (
    showFAQButton && (
      <div className="fixed bottom-5 right-5 shadow-xl">
        <button 
          className="text-white py-1 px-3 flex items-center"
          onClick={onClick} // Use the passed function
        >
          <img src={FAQ} alt="FAQ" className="h-12 w-12 hover:scale-105 duration-200"/>
        </button>
      </div>
    )
  );
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleFAQClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div style={bgStyle} className="overflow-x-hidden">
            <div className="min-h-screen bg-white/50 backdrop-blur-3xl">
              <Routes>
                <Route path="/" element={<><Navbar /><Hero /><Topmenu /><Banner /><Footer /></>} />
                <Route path="/menu" element={<><Navbar /><Menu /><Footer /></>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/account-settings" element={<PrivateRoute><AccountSettings /></PrivateRoute>} />
                <Route path="/notification" element={<PrivateRoute><Notification /></PrivateRoute>} />
                <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <FAQButton onClick={handleFAQClick} /> {/* Pass the click handler */}
            <FAQModal isOpen={isModalOpen} onClose={handleCloseModal} /> {/* Render the FAQ modal */}
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
