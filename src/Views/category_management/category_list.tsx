import { useState } from "react";
import { IconButton } from "../../Components/Button";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import { useStorageQuery } from "../../Storage/use_storage";
import * as storage from "../../Storage";

export default function CategoryList() {
  const currentWindow = useProvideCurrentWindow({ title: "Lista de Categorias" });
  const categories = useStorageQuery(storage.getAllCategories, []) ?? [];

  const [expandedItemKey, setExpandedItemKey] = useState<storage.CategoryID | null>(null);

  return (
    <main
      className="bg-grey-100 relative flex h-full w-full flex-col gap-4 overflow-y-scroll pb-8 font-serif"
      onClick={setExpandedItemKey.bind(null, null)}>
      <nav className="border-grey-800 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">{currentWindow.title}</h1>
      </nav>
      <p className="mx-4">Todas as substâncias registradas estão aqui.</p>
      <ul>
        {categories.map((category) => {
          const datapointCount = category.sessions.reduce((acc, s) => acc + s.datapoints.length, 0);
          const sessionCount = category.sessions.length;

          return (
            <li
              key={category.id}
              className="bg-grey-0 border-grey-800 shadow-pixel mx-4 mb-2 flex flex-col border"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedItemKey(category.id);
              }}>
              <div className="p-2">
                <h2 className="grow text-xl">{category.friendly_name}</h2>
                <p className="leading-4">{datapointCount.toString()} coletas de dados</p>
                <p className="leading-4">{sessionCount.toString()} sessões de coleta</p>
              </div>
              {expandedItemKey === category.id && (
                <footer className="border-grey-800 bg-grey-200 flex justify-end gap-2 border-t p-2">
                  <IconButton iconName="Delete16">Apagar</IconButton>
                  <IconButton iconName="Edit16">Editar</IconButton>
                </footer>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
