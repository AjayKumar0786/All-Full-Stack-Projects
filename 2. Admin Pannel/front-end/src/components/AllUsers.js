import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [imageInput, setImageInput] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/users');

        if (response.data && response.data.status === 'success') {
          const sortedUsers = response.data.data.slice().sort((a, b) => b.id - a.id);

          setUsers(sortedUsers);
          console.log('Fetched and sorted users:', sortedUsers);

          const token = sessionStorage.getItem('token');
          if (token) {
            const userResponse = await axios.get('http://localhost:3000/user/loggedInUser', {
              headers: { 'x-auth-token': token }
            });
            console.log('Fetched logged-in user:', userResponse.data.user);
            setLoggedInUser(userResponse.data.user);
            setNameInput(userResponse.data.user.name || '');
          } else {
            console.log('No token found');
          }
        } else {
          console.error('Error fetching users:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    try {
      const response = await axios.post('http://localhost:3000/user/blockUser', { id: userId }, {
        headers: { 'x-auth-token': sessionStorage.getItem('token') }
      });
      if (response.status === 200) {
        setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, blocked: true } : user));
        alert('User blocked successfully');
      } else {
        alert('Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('You Cannot Block Yourself');
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const response = await axios.post('http://localhost:3000/user/unblockUser', { id: userId }, {
        headers: { 'x-auth-token': sessionStorage.getItem('token') }
      });
      if (response.status === 200) {
        setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, blocked: false } : user));
        alert('User unblocked successfully');
      } else {
        alert('Failed to unblock user');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Error unblocking user');
    }
  };

  const handleImageClick = (image) => {
    setPreviewImage(image);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const handleNameChange = (e) => {
    setNameInput(e.target.value);
  };

  const handleImageChange = (e) => {
    setImageInput(e.target.files[0]);
  };

  const toggleEditForm = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', nameInput);
    if (imageInput) {
      formData.append('profilePhotos', imageInput); // 'images' must match the field name the backend expects
    }
  
    try {
      const response = await axios.post('http://localhost:3000/user/profile/update', formData, {
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data[0].Code === 200) { 
        setLoggedInUser((prevUser) => ({
          ...prevUser,
          name: nameInput,
          image: response.data[0].imageUrls[0]?.url || prevUser.image,
        }));
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setIsEditing(false);
    }
  };
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (indexOfLastUser < users.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (indexOfFirstUser > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      {/* Display Logged-In User Profile Photo */}
      <div className='bg-white ml-8 p-0 mt-6 rounded-2xl pl-3 mr-6 flex items-center space-x-4 justify-end'>
        <img
          src={loggedInUser?.image || 'https://via.placeholder.com/50'}
          alt={`${loggedInUser?.name || 'User'}'s profile`}
          className="w-12 h-12 rounded-full "
          onClick={() => handleImageClick(loggedInUser?.image || 'https://via.placeholder.com/50')}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/50';
          }}
        />
        <div>
          <p className="text-lg text-black-600 pb-3 pt-2 mr-10">
            {loggedInUser?.name || 'Guest'}
          </p>
          <button
            onClick={toggleEditForm}
            className="px-1 mb-3 mr-3 bg-gray-400 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            {isEditing ? 'Cancel' : 'Update Profile'}
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleUpdateProfile} className="bg-white p-4 rounded-lg shadow-md mt-6 ml-8 mr-6">
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              value={nameInput}
              onChange={handleNameChange}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Profile Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="border rounded-md p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Update Profile
          </button>
        </form>
      )}

      {/* Display List of Users */}
      <div className='bg-white p-4 ml-8 mt-6 mr-6 rounded-2xl mb-12'>
        <h1 className='font-bold ml-2'>View All Users</h1>

        <div>
          <div className="grid grid-cols-5 gap-20 font-semibold text-gray-800 mb-4 border-b pt-10 pb-2">
            <div className='ml-2 p-0'>User</div>
            <div className='ml-[-70px]'>Name</div>
            <div className='ml-[-100px]'>Email</div>
            <div className='ml-[13px]'>Phone No</div>
            <div className='ml-[-10px]'>Actions</div>
          </div>
          <ul>
            {currentUsers.map(user => (
              <li key={user.id} className="border-b py-4 flex items-center">
                <div className="w-1/5">
                  <img
                    src={user.image || 'https://via.placeholder.com/150'}
                    alt={`${user.name}'s profile`}
                    className="w-12 h-12 rounded-full cursor-pointer"
                    onClick={() => handleImageClick(user.image || 'https://via.placeholder.com/150')}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
                <div className="w-2/5 text-lg text-gray-800 ml-[-40px]">
                  {user.name}
                </div>
                <div className="w-2/5 text-sm text-gray-600 ml-[-195px]">
                  {user.email}
                </div>
                <div className="w-1/5 text-sm text-gray-600 ml-[-50px]">
                  {user.phone}
                </div>
                <div className="w-1/5 flex space-x-5 mr-[-40px]">
                  {!user.blocked ? (
                    <button
                      onClick={() => handleBlock(user.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(user.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                    >
                      Unblock
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-end items-center mt-4 space-x-4 mr-20">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage}</span>
            <button
              onClick={nextPage}
              disabled={indexOfLastUser >= users.length}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full max-w-md max-h-md object-contain"
            />
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
