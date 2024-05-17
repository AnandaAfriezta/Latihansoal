"use client";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React from "react";
import { useRouter } from "next/navigation";

const DetailBankButton = ({ id_bank_soal }: { id_bank_soal: number }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`bank_soal/detail_banksoal/${id_bank_soal}`);
  };

  return (
    <button onClick={handleClick} className="btn btn-outline hover:text-white">
      Detail soal
    </button>
  );
};

export default DetailBankButton;
