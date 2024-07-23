import React, { useState } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitAnswer = async (id_jawaban: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const token = Cookies.get("UserToken");
      if (!token) {
        throw new Error("User data not found. Please login again.");
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
        }
      );
      if (!res.ok) {
        throw new Error("Failed to submit answer.");
      }
      console.log("Answer submitted successfully.");
      setError(null);
    } catch (error: any) {
      console.error("Error submitting answer:", error.message);
      setError("Error submitting answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = () => {
    onAnswerClick(id_jawaban);
    handleSubmitAnswer(id_jawaban);
  };

  return (
    <div className="w-full mb-2">
      <label
        className={`flex items-center bg-white rounded-xl border border-[#999CA1] py-2 px-4 text-black text-sm justify-between w-full mb-2 ${isSelected ? 'selected border-purple-500 border-2' : ''}`}
        onClick={handleClick}
      >
        <input
          type="radio"
          checked={isSelected}
          readOnly
          className="custom-radio"
        />
        <span className="flex-grow ml-5">{konten_jawaban}</span>
      </label>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default DetailAnswer;
