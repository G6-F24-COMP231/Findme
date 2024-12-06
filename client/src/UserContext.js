import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);


    // On mount, check if user data exists in localStorage or sessionStorage (depending on your implementation)
    useEffect(() => {
      const storedUser = localStorage.getItem('user'); // Or sessionStorage depending on how you're storing user data
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

