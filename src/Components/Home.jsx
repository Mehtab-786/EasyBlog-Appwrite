import React, { useEffect, useState } from 'react';
import { fetchRandomPhotos } from '../API/RandomPhotos';
import { fetchSearchedPhotos } from '../API/SearchedPhotos';
import { databases, ID, account } from './Appwrite/Auth';
import { addData, removeData } from '../Store/stateSlices';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from '../Components/Login'

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

function Home() {
    const dispatch = useDispatch();
    const userdataAuth = useSelector((state) => state.authData.status);     // checking user logged in or out
    const [photos, setPhotos] = useState([]);
    const [query, setQuery] = useState('');                                 // for searching user's arguments
    const [likedPhotos, setLikedPhotos] = useState([]);                 
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);                                     // Track the current page
    const [isLoadingMore, setIsLoadingMore] = useState(false);               // Track the load-more state
    const [debounceQuery, setdebounceQuery] = useState('')                   // for stopping excessive api calls
    const navigate = useNavigate();

    useEffect(() => {                               // helps in delaying search , avoids rapid API calling
      const handler = setTimeout(() => {
        setdebounceQuery(query)
      }, 500)
      return () => clearTimeout(handler)            // kill timer
    }, [query])
  

    useEffect(() => {                                   
        async function fetchData() {                    // data fetching fucntion
            const data = query
                ? await fetchSearchedPhotos(debounceQuery, page, 20)    //searched images 
                : await fetchRandomPhotos(page, 20);                    // random images
            setPhotos(data.photos);
            setLoading(false);
        }
        fetchData();
    }, [debounceQuery]);

    useEffect(() => {
        async function checkUser() {
          setPage(1)                              //resetting page if users visit's again
            try {
              const user = await account.get();
              navigate('/')
            } catch (err) {
                console.error("User is not logged in. Redirecting to login...");
                navigate('/login'); // Redirecting user to the login page if not logged in
            }
        }
        checkUser();
    }, [navigate]);  // give navigate her 

    const toggleLike = (photo) => {
        const isPhotoLiked = likedPhotos.some((p) => p.id === photo.id);    // returns true or false for particular photo

        if (isPhotoLiked) {     // is true
            setLikedPhotos((prev) => prev.filter((p) => p.id !== photo.id));      // then remove the photo , when disliked
            dispatch(removeData({ id: photo.id }));                               // Pass correct payload structure for store
        } else {
            setLikedPhotos((prev) => [...prev, photo]);
            dispatch(addData({ id: photo.id, photo })); // Pass correct payload structure
            createDocument(photo);          // creating file in database
        }
    };

    const createDocument = async (photo) => {
        try {
          const user = await account.get();  // Get the logged-in user
          const userId = user.$id;  // Get the user's unique ID

          await databases.createDocument(     // for creating a file in database
                databaseId,
                collectionId,
                ID.unique(),
                {
                  title: String(photo.alt),
                  photoId: String(photo.id),
                  src: String(photo.src.portrait),
                  url: String(photo.url),
                  userId : userId,
                }
            );
        } catch (error) {
            console.error("Error creating document:", error);
            if (error.code === 401) {
                console.error("User is not logged in. Please log in to perform this action.");
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const loadMoreImages = async () => {
      setIsLoadingMore(true);
      try {
          const data = query
              ? await fetchSearchedPhotos(debounceQuery, page + 1,20)
              : await fetchRandomPhotos(page + 1, 20);
          setPhotos((prevPhotos) => [...prevPhotos, ...data.photos]);
          setPage((prevPage) => prevPage + 1);
      } catch (error) {
          console.error("Error loading more images:", error);
      } finally {
          setIsLoadingMore(false);
      }
  };
      

  return (
    <div className="w-full bg-gray-100 px-6 ">
          {!userdataAuth ? (
            <Login />
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              {/* Search Bar */}
              <div className="w-full max-w-lg mt-4">
                <input
                  type="text"
                  placeholder="Search for images..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              {/* Images Grid */}
              <div className="w-full flex gap-6 flex-wrap justify-center">

              {photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative bg-white rounded-lg shadow-md w-72 flex flex-col justify-between overflow-hidden group">
                  {/* Image Section with Hover Effects */}
                  <div className="relative">
                    <img
                      src={photo.src.portrait}
                      alt={photo.photographer}
                      className="h-72 w-full object-cover rounded-t-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="mt-2 text-lg font-bold text-gray-700">{photo.photographer}</p>
                    <p className="mt-1 text-sm text-gray-500 h-6 overflow-hidden">
                      {photo.alt || 'No title available'}
                    </p>

                    {/* Button Section */}
                    <button
                      onClick={() => {
                        userdataAuth ? toggleLike(photo) : alert('Please Log in');
                      }}
                      className={`mt-auto w-full py-2 rounded-lg text-white font-bold focus:outline-none focus:ring-2 ${
                        likedPhotos.some((p) => p.id === photo.id)
                          ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                          : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                      }`}>
                      {likedPhotos.some((p) => p.id === photo.id) ? 'Unlike' : 'Like'}
                    </button>
                  </div>
                </div>
              ))}

            </div>

      {/* Load More Images Button */}
      <div className="w-full flex justify-center mt-4">
        <button
          onClick={loadMoreImages}
          disabled={isLoadingMore}
          className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-auto max-w-xs">
          {isLoadingMore ? 'Loading...' : 'Load More Images'}
        </button>
      </div>              
    </div>
  )}
    </div>
  );
      
      



}

export default Home;

