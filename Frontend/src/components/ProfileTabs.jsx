import React, { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { SnapContext } from "../context/SnapContext";
import { FaHeart } from "react-icons/fa";
import { MdModeComment } from "react-icons/md";

const ProfileTabs = ({ postData, userData }) => {
  const [activeTab, setActiveTab] = useState("Posts");
  const tabs = ["Posts", "Saved", "Activity"];
  const [currentData, setCurrentData] = useState(null);
  const { visible, setVisible } = useContext(SnapContext);

  // ✅ Auto-update post data if it changes
  useEffect(() => {
    if (currentData) {
      const updated = postData.find((item) => item._id === currentData._id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentData)) {
        setCurrentData(updated);
      }
    }
  }, [postData]);

  return (
    postData && (
      <div className="w-full sm:px-6 xl:px-6">
        {/* ✅ Tabs */}
        <div className="flex gap-8 text-lg font-semibold border-b w-full border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-colors duration-200 ${
                activeTab === tab
                  ? "border-b-4 border-transparent bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ✅ Tab Content */}
        <div className="mt-6">
          {/* ✅ Posts */}
          {activeTab === "Posts" && (
            <div className="grid grid-cols-3 w-full gap-1 xl:gap-4">
              {postData.length > 0 ? (
                postData.map((item, index) => {
                  const firstMedia = item?.content?.media?.[0];

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentData(item);
                        setVisible(true);
                      }}
                      className="relative aspect-[4/5] group overflow-hidden cursor-pointer"
                    >
                      {/* ✅ Display Video or Image */}
                      {firstMedia ? (
                        firstMedia.type === "video" ? (
                          <video
                            src={firstMedia.url}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={firstMedia.url}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
                          No media
                        </div>
                      )}

                      {/* ✅ Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex items-center gap-6 text-white text-lg font-semibold">
                          {/* Likes */}
                          <div className="flex items-center gap-2">
                            <FaHeart />
                            <span>{item.likes?.length || 0}</span>
                          </div>

                          {/* Comments */}
                          <div className="flex items-center gap-2">
                            <MdModeComment />
                            <span>{item.comments?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No Posts yet</p>
              )}
            </div>
          )}

          {/* ✅ Saved */}
          {activeTab === "Saved" && (
            <div className="text-gray-400 text-center py-10">
              Saved content will appear here
            </div>
          )}

          {/* ✅ Activity */}
          {activeTab === "Activity" && (
            <div className="text-gray-400 text-center py-10">
              Recent activity will appear here
            </div>
          )}
        </div>

        {/* ✅ Post Modal */}
        {visible && <Post userData={userData} postData={currentData} />}
      </div>
    )
  );
};

export default ProfileTabs;
