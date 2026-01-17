import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { SnapContext } from '../context/SnapContext';
import { formatDistanceToNow } from 'date-fns';
import { Search } from 'lucide-react';
import { IoArrowBackOutline } from 'react-icons/io5';

const Messages = () => {
  const { backendUrl, userId, socket, onlineUsers, navigate } = useContext(SnapContext);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [unseenMessages, setUnseenMessages] = useState({});
  const [text, setText] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [value, setValue] = useState('');
  const [finalUsers, setFinalUsers] = useState([]);
  const containerRef = useRef(null); // flag to force scroll on chat open / switch
  const forceScrollRef = useRef(false);

  const scrollToBottomIfNeeded = (force = false) => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNearBottom = distanceFromBottom < 150; // within 150px considered "at bottom"
    if (force || isNearBottom) { // ensure DOM painted
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  };

  // when messages change: scroll only if user is near bottom or we forced scroll
  useEffect(() => {
    scrollToBottomIfNeeded(forceScrollRef.current);
    forceScrollRef.current = false;
  }, [messages]);

  // when switching chats, force scroll to bottom
  useEffect(() => {
    forceScrollRef.current = true;
    scrollToBottomIfNeeded(true); // also fetch messages for new user (handled in getMessages effect)
  }, [selectedUser?._id]);

  const getUserChats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/messages/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setUsers(response.data.users);
        setUnseenMessages(response.data.unseenMessages || {});
      }
      if (response.data.users?.length > 0 && !selectedUser) {
        setSelectedUser(response.data.users[0]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async () => {
    if (!selectedUser?._id) return;
    try {
      const response = await axios.get(`${backendUrl}/api/messages/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      if (text.trim().length > 0 && selectedUser?._id) {
        const { data } = await axios.post(
          `${backendUrl}/api/messages/send/${selectedUser._id}`,
          { text },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (data.success) {
          setMessages((prev) => [...prev, data.newMessage]);
          setText('');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on('newMessage', (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios
          .put(`${backendUrl}/api/messages/mark/${newMessage._id}`)
          .catch(() => {});
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]:
            prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1,
        }));
      }
    });
  };

  const unSubscribeFromMessages = () => {
    if (socket) socket.off('newMessage');
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeFromMessages(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedUser?._id]);

  useEffect(() => {
    getUserChats(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineUsers]);

  useEffect(() => {
    getMessages(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?._id]);

  const getUsers = () => {
    if (value.trim().length > 2) {
      const filtered = users.filter((item) =>
        item.username.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
      setFinalUsers(filtered);
    } else {
      setFinalUsers(users);
    }
  };

  useEffect(() => {
    getUsers();
  }, [users, value]);

  if (!users || users.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <h1 className="text-white text-3xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex">
      {/* Sidebar */}
      <div
        className={`${
          chatOpen ? 'hidden' : 'block'
        } lg:block ${chatOpen ? '' : 'w-full'} lg:w-[420px] border-r border-[#766b6b48]`}
      >
        <div className="pl-6 pr-3 py-11 flex flex-col gap-8 min-h-0 h-full">
          <h1 className="text-5xl ml-2 outfit-700 text-white shrink-0">Messages</h1>
          {/* Search */}
          <div className="flex items-center bg-[#26224a] rounded-full gap-3 px-6 py-3 shadow-md shrink-0">
            <Search className="text-gray-400 w-6 h-6 mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              className="bg-transparent outline-none text-lg text-gray-300 placeholder-gray-400 w-full"
            />
          </div>
          {/* Users List */}
          <div className="flex-1 min-h-0 flex flex-col gap-3 w-full overflow-y-auto pr-2 custom-scrollbar">
            {finalUsers.map((user, i) => (
              <div
                key={user._id || i}
                onClick={() => {
                  setSelectedUser(user);
                  setChatOpen(true);
                }}
                className={`flex items-center gap-3 cursor-pointer transition-all p-3 rounded-lg ${
                  selectedUser?._id === user._id ? 'bg-[#111428]' : 'hover:bg-[#111428]'
                }`}
              >
                <div className="relative">
                  <img
                    src={user.profilepic}
                    className="w-16 h-16 object-cover rounded-full border border-[#3a355c]"
                    alt="profileimage"
                  />
                  {unseenMessages[user._id] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unseenMessages[user._id]}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <h1 className="text-white text-lg outfit-500">{user.username}</h1>
                  <span className="text-[#9CA6C8] text-sm outfit-300">
                    {onlineUsers?.includes(user._id) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Chat Section */}
      <div className={`${chatOpen ? 'block' : 'hidden'} lg:block flex-1`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          {selectedUser && (
            <div
              onClick={() => navigate('/profile/' + selectedUser._id)}
              className="p-3 sm:p-4 border-b border-[#766b6b48] flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <IoArrowBackOutline
                onClick={(e) => {
                  e.stopPropagation();
                  setChatOpen(false);
                }}
                className="text-white w-6 h-6 sm:w-8 sm:h-8 mr-1 lg:hidden"
              />
              <img
                src={selectedUser?.profilepic}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 object-cover"
                alt="profile"
              />
              <div>
                <p className="font-semibold text-white text-sm sm:text-base">
                  {selectedUser?.username}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {onlineUsers?.includes(selectedUser._id) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          )}
          {/* Messages */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 custom-scrollbar flex flex-col space-y-3 sm:space-y-4"
          >
            {messages.map((msg, index) => {
              const isCurrentUser = msg.senderId === userId;
              return (
                <div
                  key={msg._id || index}
                  className={`flex w-full cursor-pointer ${
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[75%]`}>
                    <div className="flex flex-col">
                      <div
                        className={`px-4 py-2 sm:px-6 sm:py-4 outfit-400 rounded-2xl text-sm sm:text-xl break-words max-w-[200px] sm:max-w-xs ${
                          isCurrentUser
                            ? 'bg-gradient-to-r from-[#4F2DB8] to-[#342787] text-white rounded-br-none'
                            : 'bg-[#1c1c28] text-gray-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span
                        className={`text-[10px] sm:text-[12px] outfit-400 mt-1 ${
                          isCurrentUser ? 'text-gray-400 self-end pr-1' : 'text-gray-500 self-start pl-1'
                        }`}
                      >
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Input */}
          <div className="p-3 sm:p-4 md:mb-0 mb-12 border-t border-[#766b6b48]">
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 sm:px-6 sm:py-4 bg-[#101022] border-[0.3px] border-[#8c8e9c52] rounded-lg outline-none text-white text-sm sm:text-base"
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r text-white outfit-400 rounded-xl sm:rounded-2xl from-[#4F2DB8] to-[#342787] px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-2xl hover:from-[#4F2DB8] hover:to-[#4F2DB8]"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
