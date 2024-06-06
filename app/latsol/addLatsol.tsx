"use client";

import React, { useState } from "react";

interface AddLatsolProps {
  onSubmit: (formData: any) => void;
}

export const AddLatsol: React.FC<AddLatsolProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nama_latihansoal: "",
    durasi: 0,
    nama_banksoal: "",
    nama_tag: "",
    status: "1",
  });

  const [modal, setModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "durasi" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setModal(false);
    resetForm();
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
      nama_latihansoal: "",
      durasi: 0,
      nama_banksoal: "",
      nama_tag: "",
      status: "1",
    });
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
        <span className="text-md font-semibold mr-2">+</span> Tambah Latihan Soal
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
                  style={{ backgroundColor: "#F2F2F2" }}
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
                  style={{ backgroundColor: "#F2F2F2" }}
                  required
                />
              </div>
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
                  style={{ backgroundColor: "#F2F2F2" }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.status === "1"}
                    onChange={handleStatusChange}
                    className="toggle toggle-primary"
                  />
                  <span className="ml-2">
                    {formData.status === "1" ? "Aktif" : "Arsip"}
                  </span>
                </div>
              </div>
              <button type="submit" className="bg-[#5CB85C] text-white p-2 rounded-md">
                Tambah Latihan Soal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddLatsol;
