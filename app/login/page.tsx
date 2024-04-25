"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const router = useRouter();
  

  const handleLogin = async () => {
    try {
      const res = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(data);
      console.log(res);
      if (res.ok) {
        // Simpan data login di dalam cookies
        Cookies.set('user', JSON.stringify(data));
        // Redirect ke halaman beranda atau halaman lain yang diinginkan
        router.push('/');
      } else {
        // Tangani pesan kesalahan dari API
        setError(data.message || 'Login gagal');
      }
    } catch (error) {
      console.error(error);
      // Tangani kesalahan koneksi atau kesalahan lainnya
      setError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <div className='w-full justify-center items-center mx-auto'>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
