"use client";

import React, { useState } from "react";

interface AddLatsolProps {
  onSubmit: (formData: any) => void;
}

export const AddLatsol: React.FC<AddLatsolProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nama_latihansoal: "",
    durasi: 0,
    nama_tag: "",
  });

  const [modal, setModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleButtonClick = () => {
    setModal((prevModal) => !prevModal);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Tambah Latihan Soal</h2>
      <button
        className="text-white w-full bg-[#5CB85C] py-3 rounded-lg text-md font-semibold mb-8 flex justify-center items-center"
        style={{ boxShadow: "0 3px 0 0 #237D3E" }}
        onClick={handleButtonClick}
      >
        <span className="text-md font-semibold mr-2">+</span> Tambah Soal
      </button>
      {modal && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nama_latihansoal"
              className="block text-sm font-medium text-gray-600"
            >
              Nama Latihan Soal
            </label>
            <input
              type="text"
              id="nama_latihansoal"
              name="nama_latihansoal"
              onChange={handleChange}
              value={formData.nama_latihansoal}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="durasi"
              className="block text-sm font-medium text-gray-600"
            >
              Durasi (menit)
            </label>
            <input
              type="number"
              id="durasi"
              name="durasi"
              onChange={handleChange}
              value={formData.durasi}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="nama_tag"
              className="block text-sm font-medium text-gray-600"
            >
              Tags
            </label>
            <input
              type="text"
              id="nama_tag"
              name="nama_tag"
              onChange={handleChange}
              value={formData.nama_tag}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Tambah Latihan Soal
          </button>
        </form>
      )}
    </div>
  );
};

export default AddLatsol;
