import React, { useContext } from "react";
import { X } from "lucide-react";
import { SnapContext } from "../context/SnapContext";

const SeenBox = ({ seenList = [], setShowSeenBox }) => {
  const { users, navigate } = useContext(SnapContext);
  const seenUsers = users.filter((u) => seenList.includes(u._id));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
      <div className="relative bg-[#0D0F1E] text-white p-5 rounded-2xl w-full max-w-sm shadow-2xl border border-white/10">
        {/* Close Button */}
        <button
          onClick={() => setShowSeenBox(false)}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2 text-center">
          Seen by {seenUsers.length}
        </h2>

        {/* List */}
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {seenUsers.length > 0 ? (
            seenUsers.map((user) => (
              <div
                key={user._id}
                onClick={()=>{navigate(`/profile/${user._id}`)}}
                className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition"
              >
                <img
                  src={user.profilepic}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <span className="text-sm font-medium">{user.username}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/50 text-center py-4">
              No views yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeenBox;
