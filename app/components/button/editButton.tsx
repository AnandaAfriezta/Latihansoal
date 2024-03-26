'use client'

import { useRouter } from 'next/navigation';
import React from 'react'

export default function EditButton({id_latihan_soal}) {
    const router = useRouter()

    function handleClick() {
        router.push(`/edit/${id_latihan_soal}`)
    }
  return (
    <>
      <p
        onClick={handleClick}
        className='text-slate-400 hover:underline cursor-pointer absolute end-8'
      >
        edit
      </p>
    </>
  );
}
