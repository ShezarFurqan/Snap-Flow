import React, { useContext, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Home from "../src/pages/Home"
import SideBar from './components/SideBar'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Login from "./pages/Login"
import Messages from './pages/Messages'
import { SnapContext } from './context/SnapContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SmallSideBar from './components/SmallSideBar'
import DownBar from './components/DownBar'
import Notification from './components/Notification'
import CreatePost from './components/CreatePost'
import Settings from './pages/Settings'
import StoryUpload from './components/StoryUpload'

const App = () => {
  const location = useLocation();
  const { token, navigate, setVisible, visible, CPOpen, open, storyOnOff, setStoryOnOff } = useContext(SnapContext);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1023);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (token) {
      if (location.pathname === "/login") {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [token, navigate, location.pathname]);

  useEffect(() => {
    setVisible(false)
  }, [location])

  return (
   <div className='bg-[#0D0F1E]'>
     <div className="bg-[#0D0F1E] custom-scrollbar flex h-screen overflow-hidden border-[#8c8e9c52] lg:rounded-3xl rounded-xl border-[0.3px]">


      {CPOpen && <CreatePost />}

      {storyOnOff && <Story />}

      {/* Sidebar */}
      {location.pathname !== "/login" &&
        location.pathname !== "/messages" &&
        !isSmallScreen && (
          <div className="hidden md:block xl:px-14 lg:px-10 px-8 py-12">
            <SideBar />
          </div>
        )}

      {/* Small Sidebar */}
      {(location.pathname === "/messages" || isSmallScreen) && (
        <div className="hidden md:block">
          <SmallSideBar />
        </div>
      )}

      {/* DownBar (always visible on mobile) */}


      {visible ? "" : <DownBar />}

      {/* Main Content */}
      <div
        className={`
          flex-1 overflow-y-auto custom-scrollbar 
          ${location.pathname === "/messages"
            ? "2xl:px-0 xl:px-0 lg:px-0 py-0"
            : "2xl:px-[5vw] xl:px-[1vw] px-4 py-12"}
          border-[#766b6b48] 
          lg:rounded-3xl 
          rounded-xl 
          border-[2px]
        `}
      >



        {open && <Notification />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/messages" element={<Messages />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </div>

      {/* Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
   </div>
  );
};

export default App;
