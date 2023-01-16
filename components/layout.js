import SideNav from "./sidenav";

function Layout({ children }) {
  return (
    <div className="flex relative">
      <SideNav />
      <div className="bg-[#d8eefe] min-h-screen text-[#5f6c7b] w-[80vw] p-8">
        {children}
      </div>
    </div>
  );
}

export default Layout;
