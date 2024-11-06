import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './FirebaseConfig'; // Adjust path as necessary
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoggedIn(!!currentUser); // Set to true if currentUser exists
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
