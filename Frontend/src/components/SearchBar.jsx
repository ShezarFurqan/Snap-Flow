import React, { useContext, useState } from 'react';
import { SnapContext } from '../context/SnapContext';
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { users, navigate } = useContext(SnapContext);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (users && value.trim().length > 2) {
      const filtered = users.filter(item =>
        item.username.toLowerCase().includes(value.trim().toLowerCase())
      );
      if (filtered.length > 0) {
        setResults(filtered);
      } else {
        setResults([{ username: "No Profile Found" }]);
      }
    } else {
      setResults([]);
    }
  };

  return users && (
    <div className="relative 2xl:w-[44vw] xl:w-[40vw] lg:w-[42vw] md:w-[56vw]">
      {/* Search Input */}
      <div className="flex items-center bg-[#26224a] rounded-full gap-3 px-10 2xl:py-4 py-3 shadow-md">
        <Search className="text-gray-400 w-10 h-10 mr-2" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={onChangeHandler}
          className="bg-transparent outline-none text-2xl text-gray-300 placeholder-gray-400 w-full"
        />
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-[#1f1b3d] border border-gray-700 rounded-b-lg shadow-lg z-10 mt-1">
          {results.map((item, index) => (
            <div
              onClick={() => { 
                if (item.username !== "No Profile Found") {
                  navigate(`/profile/${item._id}`);
                }
                setResults([]);
              }}
              key={index}
              className="px-4 py-3 hover:bg-[#2a2550] cursor-pointer text-gray-300 text-base"
            >
              {item.username}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
