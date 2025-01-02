import { Query } from "appwrite";
import { account, databases } from "./Appwrite/Auth";
import React, { useEffect, useState , } from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const status = useSelector((state) => state.authData);
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userLikedPhotos, setUserLikedPhotos] = useState([])

async function getUserInfo() {
  try {
    const user = await account.get(); // Fetch user details
    return user; // Return user details
  } catch (error) {
    console.error("Failed to get user info:", error.message);
    throw error; // Re-throw error for handling
  }
}

useEffect(() => {
    async function fetchUser() {          
      try {
        const userInfo = await getUserInfo();         
        setUser(userInfo);      // setting user information in user from getUserInfo fucntion
      } catch (err) {
        setError(err.message);
      }
    }
    fetchUser();
  }, [status]);


useEffect(() => {
  async function fetchLikedPhotos() {  

  if(!status) return ;
  
  if (status) {
    try {
      const user = await account.get()      //method to get user information from appwrite
      const userId = String(user.$id)       //extracting user Id

      const response = await databases.listDocuments(   // showing up all documents
        databaseId,
        collectionId,
        [Query.equal('userId',userId)]          // like if else , matching up user id
      );      
      
      const likedPhotos = response.documents    
      setUserLikedPhotos(likedPhotos)       // storing like photos 
      
    } catch (error) {
      setUserLikedPhotos([])          // emptying state when no data found 
      throw error
    }
  }
  
}
fetchLikedPhotos()
}, [status])



async function DeleteFile(PhotoId) {
    try {
      await  databases.deleteDocument(      // deleting documents / photos
      databaseId, // databaseId
      collectionId, // collectionId
      PhotoId // documentId
  );
      setUserLikedPhotos((prevPhotos) => prevPhotos.filter(photo => photo.$id !== PhotoId))     // updating state
    } catch (error) {
      console.error(`Error deleting photo with ID ${PhotoId}:`, error);      
      throw error
    }
}


  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {status ? (
        <>
          {/* User Info */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">User Profile</h2>

            {/* Avatar Image Section */}
            <div className="flex justify-center mb-6">
              <img
                src="https://cdn.pixabay.com/photo/2017/06/09/23/22/avatar-2388584_640.png"
                alt="User Avatar"
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-indigo-500"
              />
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-600">
                <span className="font-bold text-gray-800">Name: </span>
                {user?.name || "N/A"}
              </p>
              <p className="text-lg font-medium text-gray-600">
                <span className="font-bold text-gray-800">Email: </span>
                {user?.email || "N/A"}
              </p>
              <p className="text-lg font-medium text-gray-600">
                <span className="font-bold text-gray-800">Status: </span>
                {status ? 'True' : 'False'}
              </p>
              <p className="text-lg font-medium text-gray-600">
                <span className="font-bold text-gray-800">Registered On: </span>
                {new Date(user?.registration).toLocaleDateString() || "N/A"}
              </p>
            </div>
          </div>

          {/* Liked Photos */}
          <div className="w-full max-w-6xl">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Liked Photos</h3>
            {userLikedPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userLikedPhotos.map((photo, index) => (
                  <div
                    key={index || photo.photoId}
                    className="relative max-w-xs mx-auto bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    {/* Image Section */}
                    <div
                      className="w-full h-64 bg-gray-200 flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${photo.src || ''})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <img
                        src={photo.src || 'https://via.placeholder.com/150'}
                        alt={photo.title || 'Liked Photo'}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {photo.title || 'No Title Available'}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        {/* View Button */}
                        <a
                          href={photo.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          title="Go to image link"
                        >
                          View Full Image
                        </a>

                        {/* Cross Button */}
                        <button
                          className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                          title="Remove Photo"
                          onClick={() => DeleteFile(photo.$id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No liked photos available.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-red-500 text-lg font-medium">Please log in to view your profile.</p>
      )}
    </div>
  );
}
