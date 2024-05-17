// Import React
import React from "react";
import Cookies from "js-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface AnswerObject {
  id_latihan_soal: number;
  id_jawaban: number;
  konten_jawaban: string;
  isSelected: boolean;
  onAnswerClick: (idJawaban: number) => void;
}

const DetailAnswer: React.FC<AnswerObject> = ({
  id_latihan_soal,
  id_jawaban,
  konten_jawaban,
  isSelected,
  onAnswerClick,
}) => {
  const handleSubmitAnswer = async () => {
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
        `${apiUrl}/ujian/${id_latihan_soal}/submit-jawaban`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            id_jawaban,
          }),
        },
      );
      if (!res.ok) {
        throw new Error("Failed to submit answer.");
      }
      // Handle successful submission
      console.log("Answer submitted successfully.");
    } catch (error: any) {
      // Handle error
      console.error("Error submitting answer:", error.message);
    }
  };

  return (
    <div className="w-full mb-2">
      <label
        className={`flex items-center bg-white rounded-xl border border-[#999CA1] py-2 px-4 text-black justify-between w-full mb-2 `}
      >
        <input
          type="radio"
          onClick={() => {
            onAnswerClick(id_jawaban);
            handleSubmitAnswer();
          }}
          checked={isSelected}
          className="custom-radio"
        />
        <span className="flex-grow ml-5">{konten_jawaban}</span>
      </label>
    </div>
  );
};

// Export komponen DetailAnswer
export default DetailAnswer;
