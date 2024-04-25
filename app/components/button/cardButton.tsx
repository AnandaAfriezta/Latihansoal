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
      className="btn btn-accent text-white"
      style={{
        padding: "10px 30px",
        fontSize: "16px",
        width: "80px",
        height: "20px",
        boxShadow: "0 3px 0 0 #237D3E",
        backgroundColor: "#5CB85C"
      }}
    >
      Mulai
    </button>
  );
};

export default CardButton;
