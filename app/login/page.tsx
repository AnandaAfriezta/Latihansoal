"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(data);
      console.log(res);
      if (res.ok) {
        // Simpan data login di dalam cookies
        Cookies.set("user", JSON.stringify(data));
        // Redirect ke halaman beranda atau halaman lain yang diinginkan
        router.push("/");
      } else {
        // Tangani pesan kesalahan dari API
        setError(data.message || "Login gagal");
      }
    } catch (error) {
      console.error(error);
      // Tangani kesalahan koneksi atau kesalahan lainnya
      setError("Terjadi kesalahan. Silakan coba lagi.");
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
            Login
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
          <div>
            <label className="label font-semibold text-[#9CA3AF]">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full input-bordered bg-slate-200 text-slate-800 mb-8"
              placeholder="Masukkan Email"
            />
          </div>
          <div>
            <label className="label font-semibold text-[#9CA3AF]">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full input-bordered bg-slate-200 text-slate-800 mb-8"
              placeholder="Masukkan Password"
            />
          </div>
          <button
            onClick={handleLogin}
            className="bg-[#31B057] px-3 py-1 rounded-md text-white font-semibold text-md"
            style={{ boxShadow: "0 3px 0 0 #237D3E" }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
