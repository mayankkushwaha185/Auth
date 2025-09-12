import UserSideBar from "@/components/userSideBar";
import React, { Children } from "react";

const Userlayout = ({ children }) => {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2 h-screen">
        <UserSideBar />
      </div>
      <div className="col-span-10 bg-gray-100 h-screen">{children}</div>;
    </div>
  );
};

export default Userlayout;
