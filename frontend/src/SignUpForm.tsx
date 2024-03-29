import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { createUser } from "./api";
import Dashboard from "./Dashboard";

const SignUpForm: React.FC = () => {
  const [name, setName] = useState("");

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userBalance = localStorage.getItem("userBalance");

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["createuser"],
    enabled: false,
    queryFn: async () => {
      const body = { name };
      const res = await createUser(body);
      if (res.status !== 201) {
        throw new Error(res.data.error);
      }

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userBalance", res.data.balance);

      return res.data;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!userId || !userName || userBalance === undefined) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="border border-gray-300 rounded px-4 py-2"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    );
  }

  return <Dashboard />;
};

export default SignUpForm;
