import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-page text-navy flex flex-col">
      <Header />
      <main className="flex-1 w-full pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
