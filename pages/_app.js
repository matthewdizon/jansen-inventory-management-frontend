import "../styles/globals.css";
import { useState } from "react";
import { UserContext } from "../context/userContext";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(pageProps.user);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
