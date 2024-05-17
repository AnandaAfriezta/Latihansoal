"use client";

import React from "react";
import { useRouter } from "next/navigation";

const EditBankButton: React.FC<{ id_bank_soal: number }> = ({
  id_bank_soal,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`bank_soal/edit/${id_bank_soal}`);
  };

  return (
    <button onClick={handleClick} className="btn btn-accent text-white">
      Edit
    </button>
  );
};

export default EditBankButton;
