import React, {useEffect, useState} from "react";
import { Link, useLocation,useNavigate  } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useSupabaseUser } from '../utils/auth-clerk.jsx';
import { canAccessOwnerFeatures, promoteToHotelOwner } from '../utils/roles.js';

const BookIcon =() => (
  <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0
0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
</svg>
);

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/" },
    { name: "About", path: "/" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: supabaseUser } = useSupabaseUser();

  const handleBecomeOwner = async () => {
    if (user && supabaseUser) {
      const result = await promoteToHotelOwner(user.id);
      if (result.success) {
        alert('You are now a hotel owner! The page will refresh.');
      } else {
        alert('Failed to become hotel owner: ' + result.error);
      }
    }
  };

  useEffect(() => {

    if (location.pathname !== "/") {
        setIsScrolled(true);
      return
      }else{
        setIsScrolled(false);
      }
      setIsScrolled(prev => location.pathname !== "/" ? true : prev);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md text-gray-600 py-3 md:py-4"
          : "bg-gradient-to-b from-black/30 to-transparent text-white py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="Logo"
          className={`h-9 transition-all duration-500 ${isScrolled ? "filter invert" : ""}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </a>
        ))}
        {user && supabaseUser && (
          <>
            {canAccessOwnerFeatures(supabaseUser.role) ? (
              <button
                className={`px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all ${
                  isScrolled ? "bg-gray-50 text-gray-600 border border-black hover:bg-gray-100" : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                }`} 
                onClick={()=> navigate('/dashboard')}
              >
                Dashboard
              </button>
            ) : (
              <button
                className={`px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all ${
                  isScrolled ? "bg-blue-50 text-blue-600 border border-blue-500 hover:bg-blue-100" : "bg-blue-500/20 text-blue-100 border border-blue-300/30 hover:bg-blue-500/30"
                }`} 
                onClick={handleBecomeOwner}
              >
                Become Hotel Owner
              </button>
            )}
          </>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="Search"
          className={`w-5 h-5 transition-all duration-500 ${isScrolled ? "opacity-70" : "opacity-100"}`}
        />
        {user ? 
        (<UserButton afterSignOutUrl="/">
          <UserButton.MenuItems>
            <UserButton.Action 
              label="My Bookings" 
              labelIcon={<BookIcon />}
              onClick={() => navigate('/my-bookings')}
            />
          </UserButton.MenuItems>
        </UserButton>)
         : 
        (<button onClick={openSignIn}
          className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${
            isScrolled ? "bg-black text-white hover:bg-gray-800" : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Login
        </button>)
      }
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>
              <UserButton.Action 
                label="My Bookings" 
                labelIcon={<BookIcon />}
                onClick={() => navigate('/my-bookings')}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
        <img
          src={assets.menuIcon}
          alt=""
          className={`${isScrolled && "invert"} h-4`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            src={assets.closeIcon}
            alt="Close"
            className="h-6.5"
          />
        </button>

        {navLinks.map((link, i) => (
          <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </a>
        ))}

        {user && supabaseUser && (
          <>
            {canAccessOwnerFeatures(supabaseUser.role) ? (
              <button 
                className="border border-gray-300 px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all hover:bg-gray-100" 
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
              >
                Dashboard
              </button>
            ) : (
              <button 
                className="border border-blue-500 bg-blue-50 text-blue-600 px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all hover:bg-blue-100" 
                onClick={() => {
                  handleBecomeOwner();
                  setIsMenuOpen(false);
                }}
              >
                Become Hotel Owner
              </button>
            )}
          </>
        )}
        {!user && <button onClick={openSignIn} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
          Login
        </button>}
      </div>
    </nav>
  );
};
export default Navbar;
