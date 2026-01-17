import React, { useContext, useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { SnapContext } from '../context/SnapContext';
import Post from '../components/Post';

const Explore = () => {
  const [currentData, setCurrentData] = useState("");
  const { posts, visible, setVisible, getProfile, userData } = useContext(SnapContext);
  const [visibleCount, setVisibleCount] = useState(9); // Show 9 posts initially

  useEffect(() => {
    if (currentData.postedBy) {
      getProfile(currentData.postedBy);
    }
  }, [currentData]);

  useEffect(() => {
    if (currentData) {
      const updated = posts.find(item => item._id === currentData._id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentData)) {
        setCurrentData(updated);
      }
    }
  }, [posts]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  return posts && (
<div className="w-full flex flex-col items-center sm:mt-12">
  <div className="grid grid-cols-3 gap-[1px] w-full 2xl:max-w-6xl ">
    {posts.slice(0, visibleCount).map((item, index) => (
      <div
        key={index}
        onClick={() => {
          setVisible(true);
          setCurrentData(item);
        }}
      >
        <PostCard item={item} />
      </div>
    ))}
  </div>

  {visibleCount < posts.length && (
    <button
      onClick={loadMore}
      className="mt-6 px-6 py-2 text-white font-semibold rounded-xl transition-all duration-300 hover:opacity-90"
      style={{ backgroundColor: "#382084" }}
    >
      Load More
    </button>
  )}

  {visible && currentData && userData && (
    <Post
      postData={currentData}
      userData={[userData.profilepic, userData.username]}
    />
  )}
</div>

  );
};

export default Explore;
