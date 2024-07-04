import React, { useState } from "react";
import Cookies from "js-cookie";

interface AddBanksoalProps {
  onSubmit: (formData: any) => void;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const AddBanksoal: React.FC<AddBanksoalProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nama_banksoal: "",
  });

  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formSubmitted, setFormSubmitted] = useState(false); // New state for tracking form submission

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true); // Mark the form as submitted

    if (!formData.nama_banksoal.trim()) return; // If the field is empty, do not proceed

    try {
      const token = Cookies.get("UserToken");
      console.log("Current cookie:", token);
      if (!token) {
        throw new Error("User data not found. Please login again.");
      }

      if (!token) {
        throw new Error("Token not found in user data.");
      }

      const res = await fetch(`${apiUrl}/banksoal/add-banksoal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newBanksoal = await res.json();
        onSubmit(newBanksoal);
        setModal(false);
        resetForm();
      } else {
        // Handle error here
      }
    } catch (error) {
      console.error("Failed to add latihan soal:", error);
    }
  };

  const handleButtonClick = () => {
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nama_banksoal: "",
    });
    setFormSubmitted(false); // Reset form submission state
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      status: e.target.checked ? "1" : "0",
    }));
  };

  return (
    <div>
      <button
        className="text-white w-full bg-[#5CB85C] py-3 rounded-lg text-md font-semibold mb-8 flex justify-center items-center"
        style={{ boxShadow: "0 3px 0 0 #237D3E" }}
        onClick={handleButtonClick}
      >
        <span className="text-md font-semibold mr-2">+</span> Tambah Bank Soal
      </button>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={handleCloseModal}
            >
              X
            </button>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="nama_banksoal"
                  className="block text-sm font-medium text-gray-600"
                >
                  Nama Bank Soal
                </label>
                <input
                  type="text"
                  id="nama_banksoal"
                  name="nama_banksoal"
                  onChange={handleChange}
                  value={formData.nama_banksoal}
                  className="mt-1 p-2 border rounded-md w-full"
                  style={{ backgroundColor: "#F2F2F2" }}
                  required
                />
                {errors.konten_soal && (
                  <p className="text-red-500 text-sm">{errors.konten_soal}</p>
                )}
              </div>
              <button type="submit" className="bg-[#5CB85C] text-white p-2 rounded-md">
                Tambah Bank Soal 
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBanksoal;
