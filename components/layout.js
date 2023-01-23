import SideNav from "./sidenav";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import Login from "../pages/login";

function Layout({ children }) {
  const { user } = useContext(UserContext);

  if (!user) return <Login />;

  return (
    <div className="flex relative">
      <SideNav />
      <div className="bg-[#d8eefe] min-h-screen text-[#5f6c7b] w-[80vw] p-8 col-span-8 ml-[20vw]">
        {children}
      </div>
    </div>
  );
}

export default Layout;
