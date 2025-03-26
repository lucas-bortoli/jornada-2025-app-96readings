import AppFooter from "../../Components/AppFooter";
import Button from "../../Components/Button";

export default function HomePage() {
  return (
    <main className="bg-grey-1 relative flex h-full w-full flex-col gap-4 overflow-y-scroll font-serif">
      <nav className="border-grey-8 bg-grey-1 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Home Page</h1>
      </nav>
      <section className="flex flex-col items-stretch gap-2 px-4">
        <Button className="p-16 text-2xl">Treinamento</Button>
        <Button className="p-16 text-2xl">Classificação</Button>
        <Button className="p-16 text-2xl">Sobre o Aplicativo</Button>
      </section>
      <AppFooter />
    </main>
  );
}
