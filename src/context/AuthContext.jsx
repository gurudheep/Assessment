import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const userData = { id: user.id, name: user.name, email: user.email };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const register = async (userData) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
          reject(new Error('Email already registered'));
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          ...userData,
          createdAt: new Date().toISOString()
        };

        // Save to localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Set current user (without password)
        const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email };
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        resolve(userWithoutPassword);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};