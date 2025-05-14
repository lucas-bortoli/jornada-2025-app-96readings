import { manifest } from "../../Lib/compass_navigator";
import CategoryEditor from "./category_editor";
import CategoryList from "./category_list";

export const CategoryListWindow = manifest(CategoryList, {
  initialTitle: () => "Lista de Categorias",
  hasAnimation: true,
});

export const CategoryEditorWindow = manifest(CategoryEditor, {
  initialTitle: () => "Nova Categoria",
  hasAnimation: true,
});
