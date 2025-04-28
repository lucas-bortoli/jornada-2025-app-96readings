import { cn } from "../../../Lib/class_names";
import useKeepAwake from "../../../Lib/use_keep_awake";
import style from "./style.module.css";

export default function Inference() {
  useKeepAwake();

  return (
    <div className="bg-grey-100 flex h-full w-full flex-col gap-4 overflow-y-scroll pb-8 font-serif">
      <nav className="border-grey-800 bg-grey-1 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Classificação</h1>
      </nav>
      <section className="relative my-8 h-36 w-full shrink-0">
        <div
          className={cn(
            "shadow-pixel-sm bg-grey-500 flex items-center justify-center border",
            style.square
          )}>
          Estimador
        </div>
      </section>
      <section className="mx-4 flex flex-col items-center">
        <h1 className="text-4xl">Canela</h1>
        <span>85.1%</span>
      </section>
      <section className="bg-grey-50 border-grey-800 shadow-pixel-sm mx-auto flex w-3/4 max-w-sm flex-col gap-2 border p-4">
        <table>
          <tbody>
            {["Café", "Canela", "Chá", "Erva Mate"].map((item, I) => (
              <tr key={item + I}>
                <td>{item}</td>
                <td className="text-end font-mono text-lg">{(Math.random() * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
