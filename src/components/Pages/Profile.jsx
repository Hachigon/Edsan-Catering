import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../FirebaseConfig'; // Adjust this import according to your file structure
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import Image from '../../assets/profile.png';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [gender, setGender] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const auth = getAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const storage = getStorage();
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/profilePicture`);

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, "users", auth.currentUser.uid), { profilePicture: downloadURL });
        setProfileImage(downloadURL);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setGender(userData.gender);
          setProfileImage(userData.profilePicture);
          setEditedUser(userData);
        } else {
          console.error("No such user document!");
        }
      }
    };

    fetchUserData();
  }, [auth]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectGender = (selectedGender) => {
    setGender(selectedGender);
    setEditedUser({ ...editedUser, gender: selectedGender });
    setIsDropdownOpen(false);
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, editedUser)
        .then(() => {
          setUser(editedUser);
          setIsEditMode(false);
          alert("YOUR INFORMATION HAS BEEN SUCCESSFULLY UPDATED!");
        })
        .catch((error) => {
          console.error("Error updating profile: ", error);
        });
    } else {
      setIsEditMode(true);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };
  const handleDeleteAccount = async () => { 
    // Check if all required fields are filled
    const { firstname, lastname, age, phone, address} = editedUser;
    const isFormValid = firstname && lastname && age && phone && address && profileImage;

    if (!isFormValid) {
      alert("PLEASE FILL IN ALL REQUIRED FIELDS AND UPLOAD A PROFILE IMAGE BEFORE DELETING YOUR ACCOUNT.");
      return; // Exit the function if validation fails
    }

    const confirmed = window.confirm("ARE TOU SURE YOU WANT TO DELETE YOUR ACCOUNT? THIS ACTION CANNOT BE UNDONE.");
    if (confirmed) {
      const userId = auth.currentUser.uid;
      const userRef = doc(db, "users", userId);
      const storage = getStorage();
      const storageRef = ref(storage, `users/${userId}/profilePicture`);

      try {
        // Delete user document from Firestore
        await deleteDoc(userRef);
        // Delete profile image from Firebase Storage
        await deleteObject(storageRef);
        // Delete user from Firebase Auth
        await deleteUser(auth.currentUser);
        alert("ACCOUNT SUCCESSFULLY DELETED.");

        // Update the logged-in state and local storage
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');

        // Redirect to the home page after account deletion
        navigate("/"); // Change '/' to your home page route if different
      } catch (error) {
        console.error("Error deleting account: ", error);
        alert("FAILED TO DELETE ACCOUNT. PLEASE TRY AGAIN.");
      }
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white/70 rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex flex-col items-center mb-4">
          <img
            src={profileImage || Image}
            alt="Profile"
            className="rounded-full w-32 h-32 mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="bg-blue-950 text-white py-1 px-6 rounded hover:bg-blue-600 transition cursor-pointer">
            Change Profile
          </label>
          <h1 className="text-2xl font-semibold mb-2">{user.name}</h1>
          <p className="text-black mb-4">{user.email}</p>
        </div>
        <hr className="my-4 border-gray-950" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={editedUser.firstname || ''}
              onChange={(e) => handleInputChange("firstname", e.target.value)}
              className="border p-2 rounded bg-inherit placeholder-black w-full"
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              value={editedUser.lastname || ''}
              onChange={(e) => handleInputChange("lastname", e.target.value)}
              className="border p-2 rounded bg-inherit placeholder-black w-full"
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Age"
              value={editedUser.age || ''}
              onChange={(e) => handleInputChange("age", e.target.value)}
              className="border p-2 rounded bg-inherit placeholder-black w-full"
              readOnly={!isEditMode}
            />
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="border p-2 rounded w-full flex justify-between items-center text-black"
            >
              <span>{gender || "Select Gender"}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 bg-white border rounded shadow-md z-10">
                <button
                  onClick={() => selectGender('Male')}
                  className="block w-full text-left p-2 hover:bg-gray-100"
                >
                  Male
                </button>
                <button
                  onClick={() => selectGender('Female')}
                  className="block w-full text-left p-2 hover:bg-gray-100"
                >
                  Female
                </button>
              </div>
            )}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={editedUser.phone || ''}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="border p-2 rounded bg-inherit placeholder-black w-full"
              readOnly={!isEditMode}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Address"
              value={editedUser.address || ''}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="border p-2 rounded bg-inherit placeholder-black w-full"
              readOnly={!isEditMode}
            />
          </div>
        </div>
        <div className="mt-4">
          <textarea
            placeholder="Bio"
            value={editedUser.bio || ''}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="border p-2 rounded bg-inherit placeholder-black w-full"
            readOnly={!isEditMode}
            rows={3} // Adjust height as needed
          />
        </div>
        <div className="flex gap-2 mt-4">
          {isEditMode && (
            <>
              <button
                onClick={handleEditToggle}
                className="bg-blue-950 text-white py-2 px-4 rounded hover:bg-blue-600 transition w-full"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setEditedUser(user); // Revert changes
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition w-full"
              >
                Cancel Changes
              </button>
            </>
          )}
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="bg-blue-950 text-white py-2 px-4 rounded hover:bg-blue-600 transition w-full"
            >
              Edit Profile
            </button>
          )}
        </div>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white py-2 px-4 mt-3 rounded hover:bg-red-800 transition w-full"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
