// // context/UserContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [isLogin, setIsLogin] = useState(false);
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(true);

//   const checkAuth = () => {
//     try {
//       const token = localStorage.getItem("userToken");
//       const loginStr = localStorage.getItem("isLogin");
//       const nameStr = localStorage.getItem("username");
      
//       if (token) {
//         setIsLogin(JSON.parse(loginStr) || false);
//         setUsername(JSON.parse(nameStr) || "");
//       } else {
//         setIsLogin(false);
//         setUsername("");
//       }
//     } catch {
//       setIsLogin(false);
//       setUsername("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
    
//     const handleStorageChange = () => checkAuth();
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const logout = () => {
//     localStorage.removeItem('userToken');
//     localStorage.removeItem('isLogin');
//     localStorage.removeItem('username');
//     setIsLogin(false);
//     setUsername("");
//     window.dispatchEvent(new Event('storage'));
//   };

//   return (
//     <UserContext.Provider value={{ isLogin, username, loading, logout, checkAuth }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);