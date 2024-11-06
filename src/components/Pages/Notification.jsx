import React from 'react';

const Notification = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-white shadow-lg rounded-lg p-10 text-center">
        <h1 className="text-3xl font-semibold mb-4">Booked Notification</h1>
        <div className="flex justify-around mb-6 space-x-12">
          <button className="bg-blue-950 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 gap-8">
            Booked Status
          </button>
          <button className="bg-green-950 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300">
            Booked History
          </button>
        </div>  
        <p className="text-gray-700">You have no new notifications.</p>
      </div>
    </div>
  );
}

export default Notification;
