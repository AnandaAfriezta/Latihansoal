"use client";

import React from "react";
import { useRouter } from "next/navigation";

const CardButton: React.FC<{ id_latihan_soal: number }> = ({
  id_latihan_soal,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/exam/${id_latihan_soal}`);
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-accent btn-block text-white"
    >
      Mulai
    </button>
  );
};

export default CardButton;
