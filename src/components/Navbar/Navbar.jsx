import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Link as ScrollLink } from 'react-scroll';
import Profile from "../../assets/profile.png";
import { IoIosArrowDown } from "react-icons/io";
import FAQModal from '../../FAQ';
import { auth, db } from "../../FirebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setIsSignupModalVisible] = useState(false);
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("PLEASE ENTER YOUR EMAIL ADDRESS.");
      return;
    }

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@gmail\.com$/;

    if (!emailRegex.test(email)) {
      alert("PLEASE ENTER A VALID EMAIL ADDRESS.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("PASSWORD RESET EMAIL SENT! PLEASE CHECK YOUR INBOX.");
      closeModals();
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("FAILED TO SEND PASSWORD RESET EMAIL. PLEASE TRY AGAIN.");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const showForgotPasswordModal = () => {
    setIsForgotPasswordModalVisible(true);
    setIsLoginModalVisible(false);
    setIsSignupModalVisible(false);
    setIsDropdownVisible(false);
  }

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
    setIsSignupModalVisible(false);
    setIsDropdownVisible(false);
    setIsForgotPasswordModalVisible(false);
  };

  const showSignupModal = () => {
    setIsSignupModalVisible(true);
    setIsLoginModalVisible(false);
    setIsDropdownVisible(false);
    setIsForgotPasswordModalVisible(false)
  };

  const closeModals = () => {
    setIsLoginModalVisible(false);
    setIsSignupModalVisible(false);
    setIsForgotPasswordModalVisible(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const [isFAQModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleLogin = async (event) => {
    event.preventDefault();
  
    // Email validation: checks if it contains "@gmail.com"
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(email)) {
      alert("PLEASE ENTER A VALID GMAIL ADDRESS (e.g., example@gmail.com).");
      return;
    }
  
    // Password validation: checks if it contains at least one uppercase letter and one numeric digit
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordPattern.test(password)) {
      alert("PASSWORD MUST CONTAIN AT LEAST ONE UPPERCASE LETTER, ONE NUMERIC DIGIT, AND BE AT LEAST 6 CHARACTERS LONG.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check if the user exists in the "users" collection
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        alert("USER LOGGED IN SUCCESSFULLY.");
        closeModals();
        setIsLoggedIn(true); // Move this line here to set true only if login is successful
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        // If user does not exist in "users", log them out
        await auth.signOut();
        alert("THIS ACCOUNT DOES NOT BELONG TO A USER. PLEASE LOG IN AS AN ADMIN.");
      }
    } catch (error) {
      console.error("Error logging in: ", error.message);
      alert("INCORRECT EMAIL OR PASSWORD. PLEASE TRY AGAIN.");
      // Do not set isLoggedIn to true here
    }
  };
  
  const handleSignup = async (event) => {
    event.preventDefault();

    // Email validation: only allow @gmail.com addresses
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(email)) {
      alert("PLEASE USE A VALID @gmail.com EMAIL ADDRESS.");
      return;
    }

    // Password validation: must contain at least one uppercase letter, one numeric digit, and be at least 6 characters long
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordPattern.test(password)) {
      alert("PASSWORD MUST CONTAIN AT LEAST ONE UPPERCASE LETTER, ONE NUMERIC DIGIT, AND BE AT LEAST 6 CHARACTERS LONG.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("PASSWORD DOES NOT MATCH.");
      return;
    }

    try {
      // Attempt to create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user information in Firestore only if user creation is successful
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        firstname: '',
        lastname: '',
        age: '',
        phone: '', // or any default value
        gender: 'Male', // or any default value
        address: '', // or any default value
        bio: ''
      });

      alert("ACCOUNT CREATED SUCCESSFULLY!");
      closeModals();
    } catch (error) {
      console.error("ERROR SIGNING UP:", error.message);
      alert("SIGNUP FAILED: " + error.message);
    }
  };


  const handleLogout = async () => {
    const confirmLogout = window.confirm("ARE YOU SURE YOU WANT TO LOG OUT?");

    if (confirmLogout) {
      try {
        await auth.signOut();
        setIsLoggedIn(false); // Update the state to reflect the logged-out status
        localStorage.setItem('isLoggedIn', 'false');
      } catch (error) {
        console.error("Error logging out: ", error.message);
        alert("LOGOUT FAILED. PLEASE TRY AGAIN.");
      }
    }
  };


  return (
    <div className="py-10">
      <div className="flex justify-between items-center bg-white/15 p-6 shadow-lg">
        {/* Logo Section */}
        <div>
          <p className='text-3xl font-bold'>
            EDSAN
            <span className="ml-3 text-blue-950">
              CATERING
            </span>
          </p>
        </div>
        {/* Menu Section */}
        <div className="flex justify-center items-center gap-10 text-xl">
          <ul className="gap-20 hidden sm:flex">
            <Link className="hover:scale-110 transition duration-300 uppercase"
              onClick={() => window.location.href = '/'}>
              Home
            </Link>
            <Link className="hover:scale-110 transition duration-300 uppercase"
              onClick={() => window.location.href = '/menu'}>
              Menu
            </Link>
            <ScrollLink to="footer-about" smooth={true} duration={500} className="hover:scale-110 transition duration-300 uppercase cursor-pointer">
              About
            </ScrollLink>
          </ul>
          {/* FAQ Modal */}
          <FAQModal isOpen={isFAQModalOpen} onClose={closeModal} />

          {/* Login Section */}
          <div className="relative">
            <div className="flex gap-1 items-center">
              <div
                className="flex items-center cursor-pointer hover:scale-110 transition duration-300"
                onClick={toggleDropdown}
              >
                <img
                  src={Profile}
                  alt="Profile"
                  className="w-10 rounded-full"
                  style={{ filter: isLoggedIn ? "none" : "grayscale(100%)" }} // Apply grayscale if logged in
                />
                <IoIosArrowDown className="ml-1" />
              </div>
            </div>
            {/* Dropdown List */}
            {isDropdownVisible && (
              <div className="absolute right-0 mt-6 w-48 bg-black/80 border-gray-300 rounded-md shadow-lg z-10" role="menu">
                <ul className="py-2">
                  {isLoggedIn ? (
                    <>
                      <li className="text-white px-5 py-2 hover:bg-white/25 cursor-pointer" role="menuitem" onClick={() => navigate("/profile")}>Profile</li>
                      <li className="text-white px-5 py-2 hover:bg-white/25 cursor-pointer" role="menuitem" onClick={() => navigate("/notification")}>Notification</li>
                      <li className="text-white px-5 py-2 hover:bg-white/25 cursor-pointer" role="menuitem" onClick={() => navigate("/booking")}>Booking</li>
                      <li className="text-white px-5 py-2 hover:bg-white/25 cursor-pointer" onClick={handleLogout} role="menuitem">Log Out</li>
                    </>
                  ) : (
                    <div>
                      <li className="relative" role="menuitem">
                        <div
                          className="text-white px-5 py-2 hover:bg-white/25 cursor-pointer "
                          onClick={showLoginModal}
                        >
                          Login
                        </div>
                      </li>
                      <li className="relative" role="menuitem">
                        <div
                          className="text-white px-5 py-2 hover:bg-white/25 cursor-pointer"
                          onClick={showSignupModal}
                        >
                          Sign Up
                        </div>
                      </li>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalVisible && (
        <div className="animate-pop-up absolute flex pt-48 inset-0 items-start justify-center bg-black bg-opacity-75 z-10">
          <div className="bg-white/90 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-4 right-5 text-gray-500 hover:text-black" onClick={closeModals}>
              X
            </button>
            <div className="text-center items-center justify-center mb-6">
              <h2 className="text-2xl font-semibold mb-3 text-black">
                Welcome Back
              </h2>
              <p className="text-black">
                Sign in with your email address and password.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-left text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full p-2 border rounded-md bg-inherit placeholder-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-left text-black">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-2 border rounded-md bg-inherit placeholder-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-blue-950 hover:underline" onClick={showForgotPasswordModal}>
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-blue-900 transition">
                Sign In
              </button>
            </form>
            {/* Sign up link */}
            <div className="text-center mt-4">
              <p>
                Don't have an account?
                <a href="#" className="text-blue-950 hover:underline ml-2" onClick={showSignupModal}>
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignupModalVisible && (
        <div className="animate-pop-up absolute flex pt-28 inset-0 items-start justify-center bg-black bg-opacity-75 z-10">
          <div className="bg-white/90 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-4 right-5 text-gray-500 hover:text-black" onClick={closeModals}>
              X
            </button>
            <div className="text-center items-center justify-center mb-6">
              <h2 className="text-2xl font-semibold mb-3 text-black">
                Create an Account
              </h2>
              <p className="text-black">Sign up as a User</p>
            </div>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-left text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full p-2 border rounded-md bg-inherit placeholder-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-left text-black">
                  Name
                </label>
                <input
                  type="name"
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded-md bg-inherit placeholder-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-left text-black">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-2 border rounded-md bg-inherit placeholder-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-left text-black">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full p-2 border rounded-md bg-inherit placeholder-black"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-blue-900 transition"
              >
                Sign Up
              </button>
            </form>
            {/* Sign in link */}
            <div className="text-center mt-4">
              <p>
                Already have an account?
                <a href="#" className="text-blue-950 hover:underline ml-2" onClick={showLoginModal}>
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordModalVisible && (
        <div className="animate-pop-up absolute flex pt-48 inset-0 items-start justify-center bg-black bg-opacity-75 z-10">
          <div className="bg-white/90 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-4 right-5 text-gray-500 hover:text-black" onClick={closeModals}>
              X
            </button>
            <div className="text-center items-center justify-center mb-6">
              <h2 className="text-2xl font-semibold mb-3 text-black">
                Forgot Password
              </h2>
              <p className="text-black">
                Enter your email to reset your password.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div>
                <label className="block text-left text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full p-2 border rounded-md bg-inherit placeholder-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-blue-900 transition"
              >
                Reset Password
              </button>
            </form>
            {/* Back to login link */}
            <div className="text-center mt-4">
              <p>
                Remember your password?
                <a href="#" className="text-blue-950 hover:underline ml-2" onClick={showLoginModal}>
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;