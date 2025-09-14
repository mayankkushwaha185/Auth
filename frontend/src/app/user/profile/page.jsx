"use client";

import { useGetUserQuery } from "@/lib/services/auth";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { data, isSuccess } = useGetUserQuery();

  useEffect(() => {
    if (data && isSuccess) {
      setUser(data.user);
    }
  }, [data, isSuccess]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>

        {user ? (
          <>
            <div className="mb-4">
              <label className="block font-medium mb-2">
                Name: {user.name}
              </label>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">ID: {user._id}</label>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">
                Email: {user.email}
              </label>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">
                Role: {user.roles}
              </label>
            </div>
          </>
        ) : (
          <p className="text-center">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
