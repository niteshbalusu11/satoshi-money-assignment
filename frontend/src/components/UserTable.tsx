import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, sendTokens } from "../api";

type User = {
  id: string;
  name: string;
  balance: number;
};

const UserTable: React.FC = () => {
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const currentUser = localStorage.getItem("userId")!;

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const mutation = useMutation({
    mutationFn: sendTokens,
    onSuccess: () => {
      refetch();
      setSelectedUserId("");
      setAmount(0);
      queryClient.invalidateQueries({
        queryKey: ["getuser"],
      });
    },
  });

  const handleSend = (userId: string) => {
    const senderId = localStorage.getItem("userId");
    if (!amount || Number.isNaN(amount)) {
      alert("not a number");
      return;
    }

    if (senderId && Number.isInteger(amount)) {
      mutation.mutate({ id: senderId, receiverId: userId, amount });
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Balance</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            ?.filter((user: User) => user.id !== currentUser)
            .map((user: User) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.balance} tokens</td>
                <td className="border px-4 py-2">
                  {selectedUserId === user.id ? (
                    <div>
                      <input
                        type="number"
                        step="1"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 mr-2"
                      />
                      <button
                        onClick={() => handleSend(user.id)}
                        className="bg-blue-500 text-white rounded px-2 py-1"
                      >
                        Send
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedUserId(user.id)}
                      className="bg-blue-500 text-white rounded px-2 py-1"
                    >
                      Send Tokens
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
