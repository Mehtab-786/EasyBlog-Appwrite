import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";


export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="py-6">
        <Outlet />         
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p> 2024 MyBlog. This is a personal project created for learning and experimentation. </p>
      </footer>
    </div>
  );
}
