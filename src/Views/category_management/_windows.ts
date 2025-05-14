import { manifest } from "../../Lib/compass_navigator";
import CategoryList from "./category_list";

export const CategoryListWindow = manifest(CategoryList, {
  initialTitle: () => "Lista de Categorias",
  hasAnimation: true,
});
