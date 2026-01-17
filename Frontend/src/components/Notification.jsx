import React, { useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { SnapContext } from "../context/SnapContext";
import { formatDistanceToNow } from 'date-fns'

import axios from "axios";

const Notification = () => {
  const { open, setOpen, backendUrl, userId, Notifications, GetNotifications} = useContext(SnapContext);

  const MarkasReadNotification = async () => {
    try {

      const response = await axios.put(backendUrl + `/api/notification/mark-read/${userId}`);
      
      GetNotifications()
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
      
    }
  }


  const getNotificationText = (notiData) => {
    switch (notiData.type) {
      case "follow":
        return "started following you";
      case "like":
        return "liked your post";
      case "comment":
        return `commented: "${notiData.commentText}"`;
      default:
        return "did something";
    }
  };

  useEffect(()=>{
    MarkasReadNotification()
  },[])

  return (
    <div className="relative">
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#111325] shadow-lg z-50 transform transition-transform duration-500 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } w-full md:w-[400px]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg outfit-300 text-white">Notifications</h2>
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)] outfit-300 text-white">
          {Notifications.length === 0 ? (
            <p className="text-gray-400 text-sm">No notifications yet</p>
          ) : (
            Notifications.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={item.userData?.profilepic || "https://via.placeholder.com/40"}
                  alt="user"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{item.userData?.username || "Someone"}</span>{" "}
                    {getNotificationText(item.notiData)}
                  </p>
                  <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(item.notiData?.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
