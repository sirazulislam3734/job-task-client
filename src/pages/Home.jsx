import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";


const Home = () => {
  const navigate = useNavigate();
  const {user} = useAuth()

  const handleNavigation = () => {
    const isLoggedIn = localStorage.getItem("access-token"); // Example auth check
    if (isLoggedIn) {
      navigate("dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Job Task Management
      </motion.h1>
      <motion.p
        className="text-lg mb-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Manage your tasks efficiently with drag-and-drop functionality.
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Link to={`${user? "dashboard": "/login"}`}><button className="px-6 py-3 text-lg font-semibold bg-white text-indigo-600 rounded-lg shadow-md hover:bg-gray-200" onClick={handleNavigation}>
          Get Started
        </button></Link>
      </motion.div>
    </motion.div>
  );
};

export default Home;
