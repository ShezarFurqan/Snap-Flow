import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import NavBar from "../components/NavBar";
import FeedCard from "../components/FeedCard";
import { SnapContext } from "../context/SnapContext";
import Stories from "../components/Stories";
import Suggestions from "../components/Suggestion";
import PostInput from "../components/PostInput";
import Post from "../components/Post";

const Home = () => {
  const { posts, users, visible, setVisible, updatePost } = useContext(SnapContext);
  const [feedData, setFeedData] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);

  const POSTS_PER_PAGE = 9;

  useEffect(() => {
    if (posts && users) {
      const feed = [];

      posts.forEach((post) => {
        const user = users.find((u) => u._id === post.postedBy);
        if (user) feed.push({ userData: user, postData: post });
      });

      setFeedData(feed);
      setVisiblePosts(feed.slice(0, POSTS_PER_PAGE));
      setPage(1);
    }
  }, [posts, users, updatePost]);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const newPosts = feedData.slice(0, nextPage * POSTS_PER_PAGE);
      setVisiblePosts(newPosts);
      setPage(nextPage);
      setLoading(false);
    }, 1000);
  }, [feedData, page, loading]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    const element = document.querySelector("#scroll-end");
    if (element) observerRef.current.observe(element);

    return () => observerRef.current && observerRef.current.disconnect();
  }, [loadMore]);

  return (
    <div>
      <NavBar />
      <div className="xl:hidden block mt-8">
        <Stories />
      </div>
      <div className="md:hidden block mt-8">
        <PostInput />
      </div>

      <div className="flex mt-16 lg:px-2 justify-between">
        <div className="flex flex-col gap-10">
          {visiblePosts.map((item, index) => (
            <FeedCard
              onClick={() => {
                setVisible(true);
                setCurrentData(item);
              }}
              key={index}
              item={item}
            />
          ))}

          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="w-10 h-10 border-4 border-[#382084] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {visiblePosts.length < feedData.length && (
            <div id="scroll-end" className="h-10 w-full"></div>
          )}
        </div>

        <div className="hidden xl:block">
          <Stories />
          <Suggestions />
        </div>
      </div>

      {visible && currentData && (
        <Post
          postData={currentData?.postData}
          userData={[
            currentData?.userData?.profilepic,
            currentData?.userData.username,
          ]}
        />
      )}
    </div>
  );
};

export default Home;
