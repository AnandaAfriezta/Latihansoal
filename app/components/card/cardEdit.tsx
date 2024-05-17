import React from "react";

export default function CardEdit() {
  return (
    <form className="w-full w-[600px] max-w-screen-md">
      <div className="grid w-full items-center gap-1.5"></div>
      <label className="label font-bold text-black">Nama Latihan Soal</label>
      <input
        type="text"
        placeholder="Masukkan Nama Latihan Soal"
        className="input w-full input-bordered bg-slate-200 text-slate-800"
      />
      <label className="label font-bold text-black">Durasi (Menit)</label>
      <input
        type="number"
        id="durasi"
        name="durasi"
        className="input w-full input-bordered bg-slate-200 text-slate-800"
        placeholder="Durasi"
      />
      <button className="btn btn-accent text-white">Simpan </button>
    </form>
  );
}
