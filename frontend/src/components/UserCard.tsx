import React, { useState } from "react";
import { getUser } from "../api";
import { useQuery } from "@tanstack/react-query";

const UserCard: React.FC = () => {
  const userId = localStorage.getItem("userId");

  console.log("usercard", userId);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [balance, setBalance] = useState("");

  useQuery({
    queryKey: ["getuser"],
    queryFn: async () => {
      const res = await getUser(userId || "");

      console.log("signin res", res);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      setName(res.data.name);
      setId(res.data.id);
      setBalance(res.data.balance);

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userBalance", res.data.balance);

      return res.data;
    },
    retry: false,
  });

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-2">User Information</h2>
      <p>Name: {name}</p>
      <p>User ID: {id}</p>
      <p>Balance: {balance} tokens</p>
    </div>
  );
};

export default UserCard;
