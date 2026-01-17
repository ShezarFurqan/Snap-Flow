import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-md transition bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] outfit-300 px-6 py-2 text-base md:px-8 md:py-3 md:text-lg text-white hover:from-[#261D5E] hover:to-[#4F2DB8]"
    >
      {text}
    </button>
  );
};

export default Button;
