import { useContext, useEffect, useState } from "react";
import {
  User,
  Palette,
  Shield,
  ChevronRight,
  ArrowLeft,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { SnapContext } from "../context/SnapContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(null);

  // Profile states
  const { setToken, backendUrl, currentUser, EditProfile, setEditProfile } = useContext(SnapContext);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [banner, setBanner] = useState(null);

  // Password states
  const [CurrPassword, setCurrPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeletePosts, setShowDeletePosts] = useState(false);

  const settings = [
    { id: 1, name: "Account", icon: <User className="w-5 h-5 text-gray-300" /> },
    { id: 2, name: "Edit Profile", icon: <Palette className="w-5 h-5 text-gray-300" /> },
    { id: 3, name: "Privacy", icon: <Shield className="w-5 h-5 text-gray-300" /> },
  ];

  // 🔹 Save Profile Handler (merged from EditProfile.jsx)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();

      if (username) formdata.append("username", username);
      if (bio) formdata.append("bio", bio);
      if (profilePic) formdata.append("profilepic", profilePic);
      if (banner) formdata.append("banner", banner);

      const response = await axios.put(
        `${backendUrl}/api/users/edit/${currentUser._id}`,
        formdata
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // 🔹 Change Password Handler
  const handleChangePassword = async () => {
    try {
      if (NewPassword.length < 8) {
        return toast.error("New password must be at least 8 characters long");
      }

      if (NewPassword !== ConfirmPassword) {
        return toast.error("Passwords do not match");
      }

      const response = await axios.put(
        `${backendUrl}/api/users/changepassword`,
        { CurrPassword, NewPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Password updated successfully");
        setCurrPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message || "Password change failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // 🔹 Logout
  const handleLogOut = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  useEffect(() => {
    if (EditProfile) {
      setActiveTab("Edit Profile");
      setEditProfile(false)
    }
  }, [EditProfile])

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {activeTab && (
          <ArrowLeft
            className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white"
            onClick={() => setActiveTab(null)}
          />
        )}
        <h2 className="text-white text-2xl md:text-3xl font-semibold">
          Settings{activeTab ? ` / ${activeTab}` : ""}
        </h2>
      </div>

      {/* Categories OR Content */}
      {!activeTab ? (
        <div className="flex flex-col gap-4">
          {settings.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.name)}
              className="flex items-center justify-between p-4 md:p-5 rounded-xl bg-[#1A1C2E] hover:bg-[#222437] cursor-pointer transition"
            >
              <div className="flex items-center gap-3 md:gap-4">
                {item.icon}
                <span className="text-white text-base md:text-lg">{item.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-2 space-y-6">
          {/* 🔹 Edit Profile */}
          {activeTab === "Edit Profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* Banner Upload */}
              <div className="relative w-full h-32 md:h-48 bg-[#1A1C2E] rounded-xl overflow-hidden">
                <img
                  src={
                    banner
                      ? URL.createObjectURL(banner)
                      : currentUser?.banner || assets.upload_area
                  }
                  alt="banner"
                  className="w-full h-full object-cover"
                />
                <label className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded-lg cursor-pointer">
                  Change Banner
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBanner(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Avatar + Info */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[#0D0F1E]">
                  <img
                    src={
                      profilePic
                        ? URL.createObjectURL(profilePic)
                        : currentUser?.profilepic || assets.upload_area
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded-md cursor-pointer">
                    Edit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-4 py-2 md:py-3 rounded-lg bg-[#1A1C2E] text-white w-full outline-none text-sm md:text-base"
                  />
                  <textarea
                    placeholder="Bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="px-4 py-2 md:py-3 rounded-lg bg-[#1A1C2E] text-white w-full outline-none text-sm md:text-base resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 md:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm md:text-base"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* 🔹 Privacy */}
          {activeTab === "Privacy" && (
            <div className="space-y-4 md:space-y-6">
              {[
                {
                  label: "Current Password",
                  value: CurrPassword,
                  setValue: setCurrPassword,
                  show: showCurrent,
                  setShow: setShowCurrent,
                },
                {
                  label: "New Password",
                  value: NewPassword,
                  setValue: setNewPassword,
                  show: showNew,
                  setShow: setShowNew,
                },
                {
                  label: "Confirm New Password",
                  value: ConfirmPassword,
                  setValue: setConfirmPassword,
                  show: showConfirm,
                  setShow: setShowConfirm,
                },
              ].map((field, index) => (
                <div key={index} className="relative">
                  <input
                    type={field.show ? "text" : "password"}
                    placeholder={field.label}
                    value={field.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    className="px-4 py-2 md:py-3 rounded-lg bg-[#1A1C2E] text-white w-full outline-none text-sm md:text-base pr-10"
                  />
                  {field.show ? (
                    <EyeOff
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                      onClick={() => field.setShow(false)}
                    />
                  ) : (
                    <Eye
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                      onClick={() => field.setShow(true)}
                    />
                  )}
                </div>
              ))}

              <button
                onClick={handleChangePassword}
                className="w-full py-2 md:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm md:text-base"
              >
                Update Password
              </button>

              <button
                onClick={handleLogOut}
                className="w-full py-2 md:py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold text-sm md:text-base"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}

          {/* 🔹 Account */}
          {activeTab === "Account" && (
            <div className="space-y-6">
              {/* Delete Profile */}
              <div className="p-4 rounded-xl flex flex-col gap-3">
                <h3 className="text-white font-semibold text-xl">Delete Profile</h3>
                <p className="text-gray-400 text-lg">
                  Permanently delete your account. This action cannot be undone.
                </p>
                <button
                  className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-lg"
                >
                  Delete Profile
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
