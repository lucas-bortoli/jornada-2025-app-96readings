import AppFooter from "../../Components/AppFooter";
import Button from "../../Components/Button";
import SpriteIcon from "../../Components/SpriteIcon";
import { cn } from "../../Lib/class_names";
import { manifest, useWindowing } from "../../Lib/compass_navigator";
import { AboutWindow } from "../about/_windows";
import { CategoryListWindow } from "../category_management/_windows";
import { ConnectionWindow } from "../connection/_windows";
import { InferenceSetupWindow } from "../inference/_windows";
import { NewEstimatorPageWindow } from "../training_view/windows";
import style from "./style.module.css";

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
        <Button
          className={cn("relative h-32 overflow-hidden text-xl", style.menuButton)}
          onClick={openPage.bind(null, "Connection")}>
          <SpriteIcon name="Bluetooth128" className="absolute top-1/2 right-4 -translate-y-1/2" />
          <span className="absolute bottom-1 left-2">Conexão</span>
        </Button>
        <Button
          className={cn("relative h-32 text-xl", style.menuButton)}
          onClick={openPage.bind(null, "CategoryManagement")}>
          <SpriteIcon name="Methanediol128" className="absolute top-1/2 right-4 -translate-y-1/2" />
          <span className="absolute bottom-1 left-2">Substâncias</span>
        </Button>
        <div className="flex w-full gap-2">
          <Button
            className={cn("relative h-32 shrink grow basis-0 text-xl", style.menuButton)}
            onClick={openPage.bind(null, "Training")}>
            <SpriteIcon name="Network128" className="absolute top-1/2 right-4 -translate-y-1/2" />
            <span className="absolute bottom-1 left-2">Treinamento</span>
          </Button>
          <Button
            className={cn("relative h-32 shrink grow basis-0 text-xl", style.menuButton)}
            onClick={openPage.bind(null, "Classification")}>
            <span className="absolute bottom-1 left-2">Classificação</span>
          </Button>
        </div>
        <Button
          className={cn("relative h-32 text-xl", style.menuButton)}
          onClick={openPage.bind(null, "About")}>
          <span className="absolute bottom-1 left-2">Sobre o Sistema</span>
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
