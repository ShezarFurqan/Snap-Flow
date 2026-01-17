import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import ProfileTabs from '../components/ProfileTabs';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { SnapContext } from '../context/SnapContext';
import axios from 'axios';
import { useParams } from 'react-router';
import Story from '../components/Story';

const Profile = () => {
  const [postData, setPostData] = useState([]);
  const [isTrue, setIsTrue] = useState(false);
  const [storyData, setStoryData] = useState([]); // ✅ story data state
  const { id } = useParams();

  const {
    backendUrl,
    posts,
    currentUser,
    setCurrentUser,
    getProfile,
    userData,
    navigate,
    setEditProfile,
    open,
    setOpen, 
  } = useContext(SnapContext);

  useEffect(() => {
    if (id) {
      getProfile(id);
      setIsTrue(false);
    }
  }, [id, isTrue]);

  useEffect(() => {
    if (posts.length && id) {
      const userPost = posts.filter((item) => item.postedBy === id);
      setPostData(userPost);
    }
  }, [posts, id]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/story/${id}`);
        if (response.data) {
          setStoryData(response.data);
        }
      } catch (error) {
        console.log('Error fetching stories:', error);
      }
    };
    if (id) fetchStories();
  }, [id]);


  const followUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${backendUrl}/api/users/${id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentUser((prevUser) => ({
        ...prevUser,
        following: [...prevUser.following, id],
      }));

      setIsTrue(true);

      if (response.data.success) toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const unFollowUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${backendUrl}/api/users/${id}/unfollow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentUser((prevUser) => ({
        ...prevUser,
        following: prevUser.following.filter((userId) => userId !== id),
      }));

      setIsTrue(true);

      if (response.data.success) toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const whatInFollowButton = () => {
    if (currentUser && Array.isArray(currentUser.followers) && Array.isArray(currentUser.following)) {
      const isFollowing = currentUser.following.includes(id);
      const isFollowedBy = currentUser.followers.includes(id);

      if (isFollowedBy && !isFollowing) {
        return <Button text={'Follow Back'} onClick={followUser} />;
      } else if (isFollowing) {
        return <Button text={'Unfollow'} onClick={unFollowUser} />;
      } else {
        return <Button text={'Follow'} onClick={followUser} />;
      }
    }
    return null;
  };

  return (
    <div className="w-full">
      <NavBar />

      <div className="mt-12">
        {/* Banner & Profile */}
        <div className="relative">
          {/* Banner */}
          <div
            className="w-full aspect-[21/9] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4] bg-cover bg-center rounded-t-2xl"
            style={{ backgroundImage: `url(${userData?.banner})` }}
          />

          {/* Profile Info */}
          <div className="relative flex flex-col md:items-start items-center sm:px-6 px-1 -mt-24 md:-mt-28 xl:-mt-[10vw] text-white">
            {/* ✅ Profile Pic */}
            <div
              onClick={() => {
                if (storyData.length > 0) setOpen(true);
              }}
              className="cursor-pointer"
            >
              <div
                className={`${
                  storyData.length > 0
                    ? 'p-[4px] bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg'
                    : 'p-[0px] bg-transparent'
                } w-[172px] h-[172px] sm:w-52 sm:h-52 md:w-56 md:h-56 xl:w-60 xl:h-60 2xl:w-64 2xl:h-64 rounded-full transition-all duration-300`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={userData?.profilepic}
                    alt="User Profile"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* Username + Bio */}
            <h1 className="outfit-600 text-2xl md:text-3xl mt-4">{userData?.username}</h1>
            <p className="text-lg md:text-xl text-[#9A9CB5]">@{userData?.username}</p>
            <h1 className="mt-2 text-center md:text-start sm:text-base md:text-lg outfit-300">{userData?.bio}</h1>

            {/* Followers / Following */}
            <div className="flex gap-6 text-base md:text-xl my-3">
              <h1>
                <span className="font-semibold">{userData?.followers?.length || 0}</span> Followers
              </h1>
              <h1>
                <span className="font-semibold">{userData?.following?.length || 0}</span> Following
              </h1>
            </div>

            {/* Edit / Follow Button */}
            <div className="mt-4">
              {currentUser._id === id ? (
                <Button text="Edit Profile" onClick={() => { setEditProfile(true); navigate('/settings'); }} />
              ) : (
                whatInFollowButton()
              )}
            </div>
          </div>
        </div>

        {/* Profile Tabs Section */}
        <div className="mt-10">
          <ProfileTabs postData={postData} userData={[userData?.profilepic, userData?.username]} />
        </div>
      </div>

     
      {open && (
        <Story
          stories={storyData} 
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;
