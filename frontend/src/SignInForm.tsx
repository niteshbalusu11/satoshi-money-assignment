import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "./api";
import Dashboard from "./Dashboard";

const SignInForm: React.FC = () => {
  const [id, setId] = useState("");

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const userBalance = localStorage.getItem("userBalance");

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["getuser"],
    enabled: false,
    queryFn: async () => {
      const res = await getUser(id);

      console.log("signin res", res);
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userBalance", res.data.balance);

      return res.data;
    },
    retry: false,
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
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter your userid"
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

export default SignInForm;
