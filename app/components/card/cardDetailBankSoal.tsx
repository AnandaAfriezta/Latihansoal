type Jawaban = {
  id_jawaban: number;
  konten_jawaban: string;
  jawaban_benar: boolean;
};

type Props = {
  id: number;
  content: string;
  explain: string;
  jawaban: Jawaban[];
};

export default function CardDetailBankSoal(props: Props) {
  return (
    <div className="collapse collapse-plus bg-white mb-4 p-2">
      <input type="checkbox" name="my-accordion-1" />
      <div className="collapse-title text-xl font-semibold text-gray-800">
        {props.content}
      </div>
      <div className="w-full collapse-content">
        <div className="flex mb-4">
          <div>
            {props.jawaban.map((jawaban) => (
              <div key={jawaban.id_jawaban}>
                <p className={`font-medium ${jawaban.jawaban_benar ? 'text-gray-500' : ''}`}>
                  {jawaban.konten_jawaban} - {""}
                  {jawaban.jawaban_benar ? "Benar" : "Salah"}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="font-medium">{props.explain}</p>
      </div>
    </div>
  );
}
