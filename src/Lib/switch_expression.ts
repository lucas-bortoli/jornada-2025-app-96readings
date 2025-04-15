type SwitchObject<T extends string | number | symbol, U> = {
  [key in T]: U;
};

export default function doSwitch<T extends string | number | symbol, U>(
  value: T,
  obj: SwitchObject<T, U>
): U {
  return obj[value];
}

type SwitchDelegateObject<T extends string | number | symbol, U> = {
  [key in T]: () => U;
};

export function doSwitchDelegate<T extends string | number | symbol, U>(
  value: T,
  obj: SwitchDelegateObject<T, U>
): U {
  return obj[value]();
}

type SwitchObjectWithDefault<T extends string | number | symbol, U> = {
  [key in T]?: U;
} & {
  default: U;
};

export function doSwitchWithDefault<T extends string | number | symbol, U>(
  value: T,
  obj: SwitchObjectWithDefault<T, U>
): U {
  return value in obj ? obj[value]! : obj.default;
}
