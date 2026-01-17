import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SnapContext } from "../context/SnapContext";
import Story from "./Story";

const Stories = () => {
  const { backendUrl, token } = useContext(SnapContext);
  const [groupedStories, setGroupedStories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStories, setSelectedStories] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state added

  const getStories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/story/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allStories = response.data.stories || [];
      const grouped = Object.values(
        allStories.reduce((acc, story) => {
          const userId = story.user._id;
          if (!acc[userId]) acc[userId] = { user: story.user, stories: [] };
          acc[userId].stories.push(story);
          return acc;
        }, {})
      );

      setGroupedStories(grouped);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getStories();
  }, []);

  const handleOpenUserStories = (userStories) => {
    setSelectedStories(userStories);
    setOpen(true);
  };

  // --- Loader Component ---
  const Loader = () => (
    <div className="flex justify-center items-center py-8">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // --- Empty State ---
  const EmptyState = () => (
    <div className="text-center py-8 text-white/70 text-sm">
      No stories yet — be the first to post a story ✨
    </div>
  );

  return (
    <section className="w-full">
      {/* --- Mobile/Tablet --- */}
      <div className="xl:hidden w-full flex items-center gap-4 overflow-x-auto py-2">
        {loading ? (
          <Loader />
        ) : groupedStories.length === 0 ? (
          <EmptyState />
        ) : (
          groupedStories.map((group, i) => (
            <div
              key={i}
              onClick={() => handleOpenUserStories(group.stories)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full border-2 border-purple-500 p-[2px]">
                <img
                  src={group.user.profilepic}
                  alt={group.user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="mt-1 text-xs text-white/80 max-w-[72px] text-center truncate">
                {group.user.username}
              </span>
            </div>
          ))
        )}
      </div>

      {/* --- Desktop --- */}
      <div className="hidden xl:block bg-[#111325] border border-white/10 rounded-2xl p-6 xl:p-8 text-white">
        <h2 className="text-2xl xl:text-3xl outfit-500 mb-4">Stories</h2>

        {loading ? (
          <Loader />
        ) : groupedStories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-3 items-center gap-5">
            {groupedStories.map((group, i) => (
              <div
                key={i}
                onClick={() => handleOpenUserStories(group.stories)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-16 h-16 xl:w-[4vw] xl:h-[4vw] rounded-full border-2 border-purple-500 p-[2px]">
                  <img
                    src={group.user.profilepic}
                    alt={group.user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="mt-1 text-sm text-white/80">
                  {group.user.username}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Story Viewer Modal --- */}
      {open && (
        <Story
          stories={selectedStories}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
};

export default Stories;
