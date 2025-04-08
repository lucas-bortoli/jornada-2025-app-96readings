import AppFooter from "../../Components/AppFooter";
import Button from "../../Components/Button";
import { manifest, useWindowing } from "../../Lib/compass_navigator";
import { NewEstimatorPageWindow } from "../training_view/windows";

export default function HomePage() {
  const windowing = useWindowing();

  function openTrainingPage() {
    windowing.createWindow(NewEstimatorPageWindow, {});
  }

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll font-serif">
      <nav className="border-grey-800 bg-grey-1 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Home Page</h1>
      </nav>
      <section className="flex flex-col items-stretch gap-2 px-4">
        <Button className="p-24 text-2xl" onClick={openTrainingPage}>
          Treinamento
        </Button>
        <Button disabled className="p-24 text-2xl">
          Classificação
        </Button>
        <Button className="p-24 text-2xl">Sobre o Aplicativo</Button>
      </section>
      <AppFooter />
    </main>
  );
}

export const HomePageWindow = manifest(HomePage, {
  initialTitle: () => "Home Page",
  hasAnimation: true,
});
