import localforage from "localforage";
import generateUUID, { UUID } from "../Lib/uuid";

/**
 * Represents a datapoint with values across multiple cycles.
 */
export interface Datapoint {
  cycle_1: number;
  cycle_2: number;
  cycle_3: number;
  cycle_4: number;
  cycle_5: number;
}

export type CategoryID = UUID & { _tag2?: "categoryId" };

/**
 * Represents a category that contains a list of datapoints.
 */
export interface Category {
  id: CategoryID;
  friendly_name: string;
  datapoints: Datapoint[];
}

type CategoryItem = Record<CategoryID, Category>;

export type CategoryInsertableUpdatable = Category & { id: never };

/**
 * Metadata of a category, excluding its datapoints.
 */
export type CategoryMetadata = Omit<Category, "datapoints">;

export type ModelID = UUID & { _tag2?: "modelId" };

/**
 * Represents a machine learning model with associated metadata.
 */
export interface Model {
  id: ModelID;
  friendly_name: string;
  size_class: string;
  data: ArrayBuffer;
  categories: CategoryMetadata[];
}

type ModelItem = Record<ModelID, Model>;

export type ModelInsertableUpdatable = Model & { id: never };

/**
 * Updates a value in localforage using an update function.
 *
 * @template T - The type of the stored value.
 * @param key - The storage key.
 * @param defaultValue - The default value if none exists.
 * @param updater - A function to modify the existing value.
 * @returns The updated value.
 */
async function update<T>(key: string, defaultValue: T, updater: (old: T) => T | Promise<T>) {
  const oldValue: T | null = await localforage.getItem(key);
  const newValue = await updater(oldValue ?? defaultValue);
  await localforage.setItem(key, newValue);
  return newValue;
}

/**
 * Creates a new category in storage.
 *
 * @param cat - The category to create.
 * @returns The ID of the created category.
 */
export async function createCategory(cat: CategoryInsertableUpdatable) {
  const id = cat.id ?? generateUUID();
  await update<CategoryItem>("category", {}, (old) => ({
    ...old,
    [id]: { ...cat, id } satisfies Category,
  }));
  return id;
}

/**
 * Retrieves a category by its ID.
 *
 * @param id - The ID of the category.
 * @returns The category if found, otherwise null.
 */
export async function getCategory(id: CategoryID) {
  const all = (await localforage.getItem<CategoryItem>("category")) ?? {};
  return all[id] ?? null;
}

/**
 * Retrieves all categories.
 *
 * @returns All stored categories.
 */
export async function getAllCategories() {
  const all = (await localforage.getItem<CategoryItem>("category")) ?? {};
  return Object.values(all);
}

/**
 * Lists all categories in storage.
 *
 * @returns An array of all categories.
 */
export async function listCategories() {
  const all = (await localforage.getItem<CategoryItem>("category")) ?? {};
  return Object.values(all);
}

/**
 * Updates an existing category by ID.
 *
 * @param id - The ID of the category to update.
 * @param patch - Partial properties to update in the category.
 * @returns The updated category data.
 * @throws If the category does not exist.
 */
export async function updateCategory(id: CategoryID, patch: CategoryInsertableUpdatable) {
  return update<CategoryItem>("category", {}, (old) => {
    if (!old[id]) throw new Error(`Category ${id} not found`);
    return {
      ...old,
      [id]: { ...old[id], ...patch },
    };
  });
}

/**
 * Deletes a category by ID.
 *
 * @param id - The ID of the category to delete.
 * @returns The updated category list without the deleted one.
 */
export async function deleteCategory(id: CategoryID) {
  return update<CategoryItem>("category", {}, (old) => {
    const { [id]: _, ...rest } = old;
    return rest;
  });
}

/**
 * Creates a new model in storage.
 *
 * @param model - The model to create.
 * @returns The ID of the created model.
 */
export async function createModel(model: ModelInsertableUpdatable) {
  const id = model.id ?? generateUUID();
  await update<ModelItem>("model", {}, (old) => ({
    ...old,
    [id]: { ...model, id } satisfies Model,
  }));
  return id;
}

/**
 * Retrieves a model by its ID.
 *
 * @param id - The ID of the model.
 * @returns The model if found, otherwise null.
 */
export async function getModel(id: ModelID) {
  const all = (await localforage.getItem<ModelItem>("model")) ?? {};
  return all[id] ?? null;
}

/**
 * Lists all models in storage.
 *
 * @returns An array of all models.
 */
export async function listModels() {
  const all = (await localforage.getItem<ModelItem>("model")) ?? {};
  return Object.values(all);
}

/**
 * Updates an existing model by ID.
 *
 * @param id - The ID of the model to update.
 * @param patch - Partial properties to update in the model.
 * @returns The updated model data.
 * @throws If the model does not exist.
 */
export async function updateModel(id: ModelID, patch: ModelInsertableUpdatable) {
  return update<ModelItem>("model", {}, (old) => {
    if (!old[id]) throw new Error(`Model ${id} not found`);
    return {
      ...old,
      [id]: { ...old[id], ...patch },
    };
  });
}

/**
 * Deletes a model by ID.
 *
 * @param id - The ID of the model to delete.
 * @returns The updated model list without the deleted one.
 */
export async function deleteModel(id: ModelID) {
  return update<ModelItem>("model", {}, (old) => {
    const { [id]: _, ...rest } = old;
    return rest;
  });
}
