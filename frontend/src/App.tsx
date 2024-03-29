import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import Dashboard from "./Dashboard";

const queryClient = new QueryClient();

// App starts here.
const App: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState<boolean | undefined>();
  const userId = localStorage.getItem("userId");

  return (
    <QueryClientProvider client={queryClient}>
      {userId ? (
        <Dashboard />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="mb-8">
            <button
              onClick={() => setIsSignIn(true)}
              className="bg-red-500 text-white rounded px-4 py-2 mr-4"
            >
              SignIn
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className="bg-red-500 text-white rounded px-4 py-2"
            >
              SignUp
            </button>
          </div>
          {isSignIn === undefined && null}
          {isSignIn === true && <SignInForm />}
          {isSignIn === false && <SignUpForm />}
        </div>
      )}
    </QueryClientProvider>
  );
};

export default App;
