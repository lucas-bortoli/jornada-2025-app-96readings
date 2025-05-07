import localforage from "localforage";
import generateUUID, { UUID } from "../Lib/uuid";

/**
 * Interface representing a Datapoint.
 */
export interface Datapoint {
  cycle_1: number;
  cycle_2: number;
  cycle_3: number;
  cycle_4: number;
  cycle_5: number;
}

/**
 * Interface representing a Category.
 */
export interface Category {
  id: UUID;
  friendly_name: string;
  datapoints: Datapoint[];
}

type CategoryItem = Record<UUID, Category>;

export type CategoryInsertableUpdatable = Category & { id: never };

export type CategoryMetadata = Omit<Category, "datapoints">;

/**
 * Interface representing a Model.
 */
export interface Model {
  id: UUID;
  friendly_name: string;
  size_class: string;
  data: ArrayBuffer;
  categories: CategoryMetadata[];
}

type ModelItem = Record<UUID, Model>;

export type ModelInsertableUpdatable = Model & { id: never };

async function update<T>(key: string, defaultValue: T, updater: (old: T) => T | Promise<T>) {
  const oldValue: T | null = await localforage.getItem(key);
  const newValue = await updater(oldValue ?? defaultValue);
  await localforage.setItem(key, newValue);
  return newValue;
}

export async function createCategory(cat: CategoryInsertableUpdatable) {
  const id = cat.id ?? generateUUID();
  await update<CategoryItem>("category", {}, (old) => ({
    ...old,
    [id]: { ...cat, id } satisfies Category,
  }));
  return id;
}

export async function getCategory(id: UUID) {
  const all = (await localforage.getItem<CategoryItem>("category")) ?? {};
  return all[id] ?? null;
}

export async function listCategories() {
  const all = (await localforage.getItem<CategoryItem>("category")) ?? {};
  return Object.values(all);
}

export async function updateCategory(id: UUID, patch: CategoryInsertableUpdatable) {
  return update<CategoryItem>("category", {}, (old) => {
    if (!old[id]) throw new Error(`Category ${id} not found`);
    return {
      ...old,
      [id]: { ...old[id], ...patch },
    };
  });
}

export async function deleteCategory(id: UUID) {
  return update<CategoryItem>("category", {}, (old) => {
    const { [id]: _, ...rest } = old;
    return rest;
  });
}

export async function createModel(model: ModelInsertableUpdatable) {
  const id = model.id ?? generateUUID();
  await update<ModelItem>("model", {}, (old) => ({
    ...old,
    [id]: { ...model, id } satisfies Model,
  }));
  return id;
}

export async function getModel(id: UUID) {
  const all = (await localforage.getItem<ModelItem>("model")) ?? {};
  return all[id] ?? null;
}

export async function listModels() {
  const all = (await localforage.getItem<ModelItem>("model")) ?? {};
  return Object.values(all);
}

export async function updateModel(id: UUID, patch: ModelInsertableUpdatable) {
  return update<ModelItem>("model", {}, (old) => {
    if (!old[id]) throw new Error(`Model ${id} not found`);
    return {
      ...old,
      [id]: { ...old[id], ...patch },
    };
  });
}

export async function deleteModel(id: UUID) {
  return update<ModelItem>("model", {}, (old) => {
    const { [id]: _, ...rest } = old;
    return rest;
  });
}
