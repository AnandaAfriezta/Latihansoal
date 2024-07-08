"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await fetch(`${apiUrl}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful! Please login.");
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen bg-white py-8">
      <div className="w-full max-w-screen-md mx-auto px-4">
        <div className="flex w-full items-center justify-between mt-3 mb-12">
          <Link href={"/"}>
            <ArrowBackIosNewIcon className="text-black" />
          </Link>
          <h1 className="font-bold text-black text-[20px] cursor-pointer hover:underline">
            Register
          </h1>
          <div className="w-8 h-8 relative rounded-full">
            <Image
              src="/avatar.png"
              alt="Avatar"
              layout="fill"
              className="rounded-full"
            />
          </div>
        </div>
        <div className="w-full items-center justify-center mt-3 mb-12">
          {error && <div style={{ color: "red" }}>{error}</div>}
          {success && <div style={{ color: "green" }}>{success}</div>}
          <div>
            <label className="label font-semibold text-[#9CA3AF]">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input w-full input-bordered bg-slate-200 text-slate-800 mb-8"
              placeholder="Enter Username"
            />
          </div>
          <div>
            <label className="label font-semibold text-[#9CA3AF]">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full input-bordered bg-slate-200 text-slate-800 mb-8"
              placeholder="Enter Email"
            />
          </div>
          <div>
            <label className="label font-semibold text-[#9CA3AF]">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full input-bordered bg-slate-200 text-slate-800 mb-8"
              placeholder="Enter Password"
            />
          </div>
          <button
            onClick={handleRegister}
            className="bg-[#31B057] px-3 py-1 rounded-md text-white font-semibold text-md"
            style={{ boxShadow: "0 3px 0 0 #237D3E" }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
