function Layout({ children }) {
  return (
    <>
      <div className="bg-[#fffffe] h-screen text-[#5f6c7b] flex flex-col gap-4 justify-center items-center">
        {children}
      </div>
    </>
  );
}

export default Layout;
