import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

export const SnapContext = createContext();

const SnapContextProvider = (props) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState("");
  const [updatePost, setUpdatePost] = useState(true);
  const [users, setUsers] = useState([]);
  const [unRead, setUnRead] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [CPOpen, setCPOpen] = useState(false);
  const [input, setInput] = useState("");
  const [EditProfile, setEditProfile] = useState(false)
  const [Notifications, setNotifications] = useState([]);
  const [onClose, setOnClose] = useState(false);


  const GetNotifications = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/notification/${userId}`);
      const rawNoti = response.data.notifications || [];

      setUnRead(rawNoti.filter(item => item.isRead === false));

      const noti = rawNoti.map((item) => ({
        userData: users?.find((user) => user._id === item.senderId),
        notiData: item,
      }));

      setNotifications(noti.reverse());
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userId && users?.length > 0) {
      GetNotifications();
    }
  }, [userId, users]);

  const connectSocket = () => {
    if (!currentUser || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: currentUser._id },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const getProfile = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/${id}`);
      setUserData(response.data.user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setToken(null);
        setUserId("");
        navigate("/login");
      }
    } else {
      setUserId("");
    }
  }, [token]);

  const getAllPosts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/post/getposts`);
      setPosts(response.data.posts);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (updatePost) {
      getAllPosts();
      setUpdatePost(false);
    }
  }, [updatePost]);

  useEffect(() => {
    connectSocket();
  }, [currentUser]);

  const getCurrentProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/${userId}`);
      setCurrentUser(response.data.user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      getCurrentProfile();
    }
  }, [userId]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/getallusers`);
      setUsers(response.data.users);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const Like = async (id) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/post/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdatePost(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    navigate,
    backendUrl,
    token,
    setToken,
    setUserId,
    userId,
    posts,
    currentUser,
    setCurrentUser,
    visible,
    setVisible,
    getProfile,
    userData,
    getAllPosts,
    setUpdatePost,
    updatePost,
    users,
    CPOpen,
    setCPOpen,
    socket,
    onlineUsers,
    setOpen,
    open,
    input,
    setInput,
    Like,
    EditProfile,
    setEditProfile,
    unRead,
    setUnRead,
    Notifications,
    setNotifications,
    GetNotifications,
    onClose,
    setOnClose
  };

  return (
    <SnapContext.Provider value={value}>
      {props.children}
    </SnapContext.Provider>
  );
};

export default SnapContextProvider;
