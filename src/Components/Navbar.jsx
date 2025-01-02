import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as userLogout } from "../Store/stateSlices";
import { account } from "./Appwrite/Auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const userdataAuth = useSelector((state) => state.authData.status);
  const navigate = useNavigate()
  const dispatch = useDispatch()

    async function logout() {
      try {
        await account.deleteSession('current');
        dispatch(userLogout());
        navigate('/login')
      } catch (error) {
        console.error('Navbar::Logout failed::', error.message);
      }
    }

    const profileComponent = () => {
      navigate('/profile')
    }

    return (
      <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg mb-0">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left Side: Logo */}
          <div className="text-3xl font-bold text-white">
            My<span className="text-yellow-300">Blog</span>
          </div>
    
          {/* Right Side: Links and Buttons */}
          <div className="flex space-x-6">
            <button 
            onClick={() => navigate('/')}
            className="text-white text-lg font-medium hover:underline"
            title="Home">
              Home
            </button>
            <button className="text-white text-lg font-medium hover:underline"
            title="Explore">
              Explore
            </button>
            <button className="text-white text-lg font-medium hover:underline" title="Contact">
              Contact
            </button>
            <button className="text-white text-lg font-medium hover:underline" title="About">
              About
            </button>
    
            {userdataAuth ? (
              <button
                onClick={logout}
                className="bg-yellow-400 text-blue-900 font-semibold px-6 py-2 rounded-full hover:bg-yellow-500" title="Logout">
                Logout
              </button>
              
            ) : (
              <button
                onClick={() => navigate('/login')} 
                className="bg-yellow-400 text-blue-900 font-semibold px-6 py-2 rounded-full hover:bg-yellow-500" title="Login">
                Login
              </button>
            )}
            {userdataAuth ? (
              <button
                onClick={profileComponent}
                className="bg-green-400 text-blue-900 font-semibold px-6 py-2 rounded-full hover:bg-green-500" title="Profile">
                Profile
              </button>
            ) :  null
          }
          </div>
        </div>
      </nav>
    );
  }
  