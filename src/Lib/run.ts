type DeferCallback = () => void;

export default function Run<T>(cb: (defer: (callback: DeferCallback) => void) => T) {
  const deferredList: DeferCallback[] = [];

  const addDeferredHandler = (callback: DeferCallback) => {
    deferredList.push(callback);
  };

  try {
    return cb(addDeferredHandler);
  } finally {
    for (const def of deferredList) def();
  }
}

type DeferAsyncCallback = DeferCallback | (() => Promise<void>);

export async function RunAsync<T>(
  cb: (defer: (callback: DeferAsyncCallback) => void) => Promise<T>
) {
  const deferredList: DeferAsyncCallback[] = [];

  const addDeferredHandler = (callback: DeferAsyncCallback) => deferredList.push(callback);

  try {
    return await cb(addDeferredHandler);
  } finally {
    for (const def of deferredList) await def();
  }
}
