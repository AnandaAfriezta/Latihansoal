import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const CardButton: React.FC<{ id_latihan_soal: number }> = ({
  id_latihan_soal,
}) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        throw new Error("User data not found. Please login again.");
      }
      const userData = JSON.parse(userCookie);
      const token = userData.token;

      if (!token) {
        throw new Error("Token not found in user data.");
      }

      const res = await fetch(
        `http://192.168.1.8:5000/ujian/${id_latihan_soal}/enrollment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to submit answer.");
      }
      router.push(`/exam/${id_latihan_soal}`);
      console.log("Answer submitted successfully.");
    } catch (error: any) {
      // Handle error
      console.error("Error submitting answer:", error.message);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="bg-[#31B057] px-3 py-1 rounded-md text-white font-semibold text-md"
      style={{ boxShadow: "0 3px 0 0 #237D3E" }}
    >
      Mulai
    </button>
  );
};

export default CardButton;
