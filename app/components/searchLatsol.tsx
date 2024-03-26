"use client";

import React, { useState } from "react";

const SearchLatsol = () => {
  const [textInput, setTextInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Nilai Input :", textInput);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="join flex justify-center max-w-screen-md"
      role="search"
    >
      <label className="join-item w-full">
        <input
          type="text"
          value={textInput}
          onChange={handleInputChange}
          className="join-item input bg-white focus:outline-none w-full text-gray-800"
          placeholder="search..."
        />
      </label>
      <button className="join-item btn btn-accent text-white">search</button>
    </form>
  );
};

export default SearchLatsol;
