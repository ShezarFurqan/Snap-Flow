import React, { useContext, useEffect, useState } from "react";
import { SnapContext } from "../context/SnapContext";

const Suggestions = () => {

  const { users, userId, navigate } = useContext(SnapContext)
  const [suggestions, setSuggestions] = useState(null)



  const getSuggestion = (users, id) => {
    const user = users.find(item => item._id === id);
    const userFollowing = user?.following;

    const AllUsers = users.filter(item => item._id !== id);

    const top3Users = [...AllUsers]
      .sort((a, b) => b.followers.length - a.followers.length)
      .slice(0, 3);

    if (!userFollowing || userFollowing.length === 0) {
      setSuggestions(top3Users);
    } else {
      const arr = [];
      userFollowing.forEach(U => {
        const us = AllUsers.find(item => item._id === U);
        if (us?.following?.length > 0) {
          us.following.forEach(ele => {
            const Sug = AllUsers.find(item => item._id === ele);
            if (Sug && Sug._id !== id && !arr.some(u => u._id === Sug._id)) {
              arr.push(Sug);
            }
          });
        }
      });

      const top3 = [...arr]
        .sort((a, b) => b.following.length - a.following.length)
        .slice(0, 3);

    
      const merged = [...top3, ...top3Users];

      
      const uniqueUsers = merged.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
      );

      
      setSuggestions(uniqueUsers.slice(0, 3));

    }
  };


  useEffect(() => {
    if (users?.length && userId) {
      getSuggestion(users, userId);
    }
  }, [users, userId]);




  return suggestions && (
    <div className="bg-[#111325] border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-[1vw] xl:p-4 text-white mt-4 sm:mt-6">
      <h2 className="text-lg sm:text-2xl xl:text-3xl outfit-500 mb-3 sm:mb-4">
        Suggestions
      </h2>

      <div className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-6">
        {suggestions.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between cursor-context-menu"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={user.profilepic}
                alt={user.username}
                className="w-12 h-12 sm:w-16 sm:h-16 xl:w-[72px] xl:h-[72px] rounded-full object-cover"
                onClick={()=>{navigate("/profile/" + user._id )}}
              />
              <div>
                <h1 onClick={()=>{navigate("/profile/" + user._id )}} className="text-sm sm:text-lg xl:text-xl outfit-400 truncate max-w-[140px] sm:max-w-[200px]">
                  {user.username}
                </h1>
                <h1>Suggested For you</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
