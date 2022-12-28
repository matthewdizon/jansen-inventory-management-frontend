import { useState, useEffect } from "react";
import Router from "next/router";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // checks data on preload from browser's password manager
  useEffect(() => {
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    setEmail(emailInput?.value);
    setPassword(passwordInput?.value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(e);

    const userDetails = {
      email,
      password,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/users/login`,
      {
        method: "POST",
        body: JSON.stringify(userDetails),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      // Get the JWT from the response
      const { accessToken } = await res.json();

      // Set the JWT in local storage
      localStorage.setItem("accessToken", accessToken);

      // Redirect the user to the home page
      Router.push("/");
    } else {
      // Set error message
      setMessage("Error: Invalid email or password");
      setShowMessage(true);
    }
  };

  return (
    <div className="bg-gray-400 h-screen text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="grid gap-2 my-8">
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="px-4 py-2 rounded-xl"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="px-4 py-2 rounded-xl"
        />
        <button className="bg-gray-200 rounded-xl font-bold uppercase p-2">
          Login
        </button>
      </form>
      {showMessage && (
        <div className="bg-red-500 text-white p-4 rounded-xl">{message}</div>
      )}
    </div>
  );
}

export default Login;
