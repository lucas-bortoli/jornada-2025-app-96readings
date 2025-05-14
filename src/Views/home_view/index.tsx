import AppFooter from "../../Components/AppFooter";
import Button from "../../Components/Button";
import { manifest, useWindowing } from "../../Lib/compass_navigator";
import { AboutWindow } from "../about/_windows";
import { CategoryListWindow } from "../category_management/_windows";
import { ConnectionWindow } from "../connection/_windows";
import { InferenceSetupWindow } from "../inference/_windows";
import { NewEstimatorPageWindow } from "../training_view/windows";

export default function HomePage() {
  const windowing = useWindowing();

  function openPage(
    page: "Connection" | "Training" | "Classification" | "CategoryManagement" | "About"
  ) {
    switch (page) {
      case "Connection":
        windowing.createWindow(ConnectionWindow, {});
        break;
      case "Training":
        windowing.createWindow(NewEstimatorPageWindow, {});
        break;
      case "Classification":
        windowing.createWindow(InferenceSetupWindow, {});
        break;
      case "CategoryManagement":
        windowing.createWindow(CategoryListWindow, {});
        break;
      case "About":
        windowing.createWindow(AboutWindow, {});
        break;
    }
  }

  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll pb-8 font-serif">
      <nav className="border-grey-800 bg-grey-1 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Home Page</h1>
      </nav>
      <section className="flex flex-col items-stretch gap-2 px-4">
        <Button className="p-24 text-2xl" onClick={openPage.bind(null, "Connection")}>
          Conexão
        </Button>
        <Button className="p-24 text-2xl" onClick={openPage.bind(null, "CategoryManagement")}>
          Categorias e Substâncias
        </Button>
        <Button className="p-24 text-2xl" onClick={openPage.bind(null, "Training")}>
          Treinamento
        </Button>
        <Button className="p-24 text-2xl" onClick={openPage.bind(null, "Classification")}>
          Classificação
        </Button>
        <Button className="p-24 text-2xl" onClick={openPage.bind(null, "About")}>
          Sobre o Aplicativo
        </Button>
      </section>
      <AppFooter />
    </main>
  );
}

export const HomePageWindow = manifest(HomePage, {
  initialTitle: () => "Home Page",
  hasAnimation: true,
});
