import SpriteIcon from "../../Components/SpriteIcon";

export default function About() {
  return (
    <main className="bg-grey-100 relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-y-scroll py-8 font-serif">
      <SpriteIcon name="Egg256" className="max-w-1/2 opacity-70" style={{ height: "unset" }} />
      <h1 className="text-3xl">96Readings</h1>
      <p>
        Versão {import.meta.env.VITE_GIT_COMMIT_HASH.slice(0, 8)} (
        {import.meta.env.VITE_GIT_BRANCH_NAME})
      </p>
    </main>
  );
}
