"use client";

const profile = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center"> User Profile</h2>

        <div className="mb-4">
          <label htmlFor="" className="block font-medium mb-2">
            Name:Mayank
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="" className="block font-medium mb-2">
            Email:mayankkushwaha185@gmail.com
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="" className="block font-medium mb-2">
            Role:User
          </label>
        </div>
      </div>
    </div>
  );
};

export default profile;
