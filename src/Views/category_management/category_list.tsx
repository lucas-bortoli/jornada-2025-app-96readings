import { useState } from "react";
import AppFooter from "../../Components/AppFooter";
import { IconButton } from "../../Components/Button";
import { cn } from "../../Lib/class_names";
import { useWindowing } from "../../Lib/compass_navigator";
import useProvideCurrentWindow from "../../Lib/compass_navigator/window_container/use_provide_current_window";
import useSort from "../../Lib/use_sort";
import * as storage from "../../Storage";
import { useStorageQuery } from "../../Storage/use_storage";
import { CategoryEditorWindow } from "./_windows";

export default function CategoryList() {
  const currentWindow = useProvideCurrentWindow({ title: "Lista de Categorias e Substâncias" });
  const categories = useStorageQuery(storage.getAllCategories, []) ?? [];
  const windowing = useWindowing();

  const [expandedItemKey, setExpandedItemKey] = useState<storage.CategoryID | null>(null);

  const sorter = useSort({
    subjects: categories,
    map: {
      byDatapointCount: (category) =>
        category.sessions.reduce((acc, s) => acc + s.datapoints.length, 0),
    },
    initialMethod: "byDatapointCount",
    initialReversed: false,
  });

  async function handleCreateButton() {
    windowing.createWindow(CategoryEditorWindow, {
      categoryId: null,
    });
  }

  async function handleDeleteButton(category: storage.Category) {}

  async function handleEditButton(category: storage.Category) {
    windowing.createWindow(CategoryEditorWindow, {
      categoryId: category.id,
    });
  }

  return (
    <main
      className="bg-grey-100 relative flex h-full w-full flex-col overflow-y-scroll pb-8 font-serif"
      onClick={setExpandedItemKey.bind(null, null)}>
      <nav className="border-grey-800 bg-grey-100 sticky top-0 z-10 mt-8 flex items-center gap-2 border-b p-4">
        <h1 className="text-xl">{currentWindow.title}</h1>
      </nav>
      <p className="mx-4 mt-4">Todas as substâncias registradas estão aqui.</p>
      <div className="mx-4 mt-8 flex justify-end">
        <IconButton iconName="AddDirectory16" onClick={handleCreateButton}>
          Criar nova substância
        </IconButton>
      </div>
      <ul className="mt-2">
        {sorter.sorted.length === 0 && (
          <>
            <li className="border-grey-800 mx-4 mb-2 border border-dashed p-8 py-16 text-center text-sm italic">
              Nenhuma substância registrada ainda.
            </li>
            <li className="border-grey-800 mx-4 mb-2 border border-dashed p-8" />
            <li className="border-grey-800 mx-4 mb-2 border border-dashed p-4" />
            <li className="border-grey-800 mx-4 mb-2 border border-dashed p-2" />
          </>
        )}
        {sorter.sorted.map((category) => {
          const datapointCount = category.sessions.reduce((acc, s) => acc + s.datapoints.length, 0);
          const sessionCount = category.sessions.length;
          const isSelected = expandedItemKey === category.id;

          return (
            <li
              key={category.id}
              className={cn(
                "bg-grey-0 border-grey-800 mx-4 mb-2 flex flex-col border",
                isSelected && "shadow-pixel-sm",
                !isSelected && "shadow-pixel"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedItemKey(category.id);
              }}>
              <div className="p-2">
                <h2 className="grow text-xl">{category.friendly_name}</h2>
                <p className="leading-4">{sessionCount.toString()} sessões de coleta</p>
                <p className="leading-4">{datapointCount.toString()} coletas de dados</p>
              </div>
              {isSelected && (
                <footer className="border-grey-800 bg-grey-200 flex justify-end gap-2 border-t p-2">
                  <IconButton iconName="Delete16" onClick={handleDeleteButton.bind(null, category)}>
                    Apagar
                  </IconButton>
                  <IconButton iconName="Edit16" onClick={handleEditButton.bind(null, category)}>
                    Editar
                  </IconButton>
                </footer>
              )}
            </li>
          );
        })}
      </ul>
      <AppFooter />
    </main>
  );
}
