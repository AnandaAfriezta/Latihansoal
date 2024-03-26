import React from "react";
import EditBankButton from "../button/editBankButton";
import EditBankSoal from "@/app/bank_soal/editBankSoal";
import DeleteBankSoal from "@/app/bank_soal/deleteBankSoal";
import DetailBankButton from "../button/detailBankButton";

type Props = {
  id_bank_soal: number;
  nama_banksoal: string;
};

export default function CardBankSoal(props: Props) {
  return (
    <div className="collapse collapse-plus bg-white mb-4 p-2">
      <input type="checkbox" name="my-accordion-1" />
      <div className="collapse-title text-xl font-semibold text-gray-800">
        {props.nama_banksoal}
      </div>
      <div className="w-full collapse-content">
        <div className="flex justify-between">
          <DetailBankButton id_bank_soal={props.id_bank_soal} />
          <div className="flex gap-2">
            <EditBankSoal {...props} />
            <DeleteBankSoal {...props} />
          </div>
        </div>
      </div>
    </div>
    // <div className="card bg-white shadow-xl my-4">
    //   <div className="card-body">
    //     <div className="w-full flex justify-between items-center">
    //       <h2 className="card-title text-gray-800 mr-2">
    //         {props.nama_banksoal}
    //       </h2>
    //       <div className="flex justify-between gap-2">
    //         <div>
    //           <EditBankSoal {...props} />
    //         </div>
    //         <div>
    //           <DeleteBankSoal {...props} />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
