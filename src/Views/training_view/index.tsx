import AppFooter from "../../Components/AppFooter";

export default function TrainingPage() {
  return (
    <main className="bg-grey-1 relative flex h-full w-full flex-col gap-4 overflow-y-scroll font-serif">
      <nav className="border-grey-8 bg-grey-1 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">Treinamento</h1>
      </nav>
      <AppFooter />
    </main>
  );
}
