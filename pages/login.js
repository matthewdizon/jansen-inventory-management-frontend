import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    }
  };

  return (
    <div className="bg-gray-400 h-screen text-center flex justify-center items-center">
      <h1 className="text-4xl font-bold">Login</h1>
      <div className="grid">
        <p>{email}</p>
        <p>{password}</p>
      </div>
      <form onSubmit={handleSubmit} className="grid">
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
