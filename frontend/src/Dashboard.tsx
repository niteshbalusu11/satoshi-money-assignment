import React from "react";

import UserCard from "./components/UserCard";
import UserTable from "./components/UserTable";

const Dashboard: React.FC = () => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userBalance = Number(localStorage.getItem("userBalance"));

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userBalance");
    window.location.href = "/";
  };

  if (!userId || !userName || !userBalance) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white rounded px-4 py-2"
        >
          Logout
        </button>
      </div>
      <UserCard />
      <UserTable />
    </div>
  );
};

export default Dashboard;
