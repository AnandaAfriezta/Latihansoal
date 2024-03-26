import CardEdit from "@/app/components/card/cardEdit";
import React from "react";

export default function EditPage() {
  return (
    <div className="w-full h-screen p-12 bg-slate-100 items-center justify-center flex">
        <div className="w-fit space-y-12 bg-white justify-center flex flex-col p-8 rounded-xl items-center">
            <h1 className="text-gray-800 font-semibold text-3xl">Edit</h1>
            <CardEdit />
        </div>
    </div>
  );
}
