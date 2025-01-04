import React, { useEffect, useState } from 'react';
import { account, ID } from './Appwrite/Auth'; // Ensure this path is correct
import {useDispatch} from 'react-redux'
import {login as userLogin, logout as userLogout} from '../Store/stateSlices'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        async function checkLoginStatus() {
            try {
                const user = await account.get();
                setLoggedInUser(user);
                dispatch(userLogin());
            } catch {
                setLoggedInUser(null);
            }
        }
        checkLoginStatus();
    }, [dispatch]);

    async function login(email, password) {
      setLoading(true);
      try {
          // Create a new session if no active session exists
          await account.createEmailPasswordSession(email, password)
          const user = await account.get() 
          setLoggedInUser(user);
          dispatch(userLogin());
          navigate('/');  // Redirect to homepage after successful login
          alert('Logged in successfully');
      } catch (error) {
          console.error('Login failed:', error.message);
          alert('Login failed. Please check your credentials or ensure your session is not active.');
      } finally {
          setLoading(false);
      }
  }
  

    async function register(email, password, name) {
        setLoading(true);
        try {
            await account.create(ID.unique(), email, password, name);
            // await account.updatePrefs({ roles: ['user'] });
            await login(email, password);
            navigate('/')
        } catch (error) {
            console.error('Registration failed:', error.message);
            alert('Registration failed. Check you credentials.');
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await account.deleteSession('current');
            setLoggedInUser(null);
            dispatch(userLogout());
            alert('You have logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error.message);
            alert('Logout failed. Please try again.');
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
            <p className="text-center text-xl font-bold text-gray-800 mb-6">
              {loggedInUser ? `Welcome, ${loggedInUser.name}!` : 'Sign In to MyBlog'}
            </p>
      
            <form className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {!loggedInUser && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}
      
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => login(email, password)}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg text-white font-bold ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}>
                  {loading ? 'Processing...' : 'Login'}
                </button>
      
                {!loggedInUser && (
                  <button
                    type="button"
                    onClick={() => register(email, password, name)}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg text-white font-bold ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                    }`}>
                    {loading ? 'Processing...' : 'Register'}
                  </button>
                )}
              </div>
            </form>
      
            {loggedInUser && (
              <button
                type="button"
                onClick={logout}
                className="mt-6 w-full px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                Logout
              </button>
            )}
          </div>
        </div>
      );
      



};

export default Login;
