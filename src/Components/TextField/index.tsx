import type {
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEventHandler,
  Ref,
  RefObject,
} from "react";
import { cn } from "../../Lib/class_names";
import { getIconUrl } from "../SpriteIcon";
import style from "./style.module.css";

interface BaseFieldProps {
  placeholder?: string;
  class?: string;
  disabled?: boolean;
  readOnly?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  style?: CSSProperties;

  // Keyboard Events
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyDownCapture?: KeyboardEventHandler<HTMLInputElement>;
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
  onKeyPressCapture?: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  onKeyUpCapture?: KeyboardEventHandler<HTMLInputElement>;
}

interface TextFieldProps extends BaseFieldProps {
  kind: "text";
  value: string;
  usesPasswordMask?: boolean;
  onInput(newValue: string): void;
}

interface NumericFieldProps extends BaseFieldProps {
  kind: "number";
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onInput(newValue: number): void;
}

export type FieldProps = TextFieldProps | NumericFieldProps;

export default function TextField(props: FieldProps) {
  let inputProps: InputHTMLAttributes<HTMLInputElement> = {
    onKeyDown: props.onKeyDown,
    onKeyDownCapture: props.onKeyDownCapture,
    onKeyPress: props.onKeyPress,
    onKeyPressCapture: props.onKeyPressCapture,
    onKeyUp: props.onKeyUp,
    onKeyUpCapture: props.onKeyUpCapture,
  };

  switch (props.kind) {
    case "text":
      inputProps = {
        ...inputProps,
        type: props.usesPasswordMask ? "password" : "text",
        value: props.value,
        onInput: (e) => props.onInput(e.currentTarget.value),
        style: { ...props.style },
      };
      break;
    case "number":
      inputProps = {
        ...inputProps,
        type: "number",
        min: props.min,
        max: props.max,
        step: props.step ?? 1,
        value: props.value,
        onInput: (e) => props.onInput(e.currentTarget.valueAsNumber),
        style: { ...props.style, fontVariantNumeric: "tabular-nums" },
      };
      break;
  }

  return (
    <input
      {...inputProps}
      placeholder={props.placeholder}
      disabled={props.disabled ?? false}
      className={cn(
        "border-grey-600 bg-grey-0 text-grey-800 shadow-pixel placeholder:text-grey-400 disabled:bg-grey-100 disabled:text-grey-600 inline-flex h-10 gap-2 border px-4 py-2 font-serif select-none disabled:shadow-none",
        props.class,
        props.kind === "number" && style.numberInput
      )}
      style={{ "--icon-url": `url('${getIconUrl("SpinnerArrow16")}')` }}
      readOnly={props.readOnly}
      ref={props.inputRef}
    />
  );
}

interface MultilineTextFieldProps {
  value: string;
  onInput(newValue: string): void;
  placeholder?: string;
  class?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  textareaRef?: Ref<HTMLTextAreaElement>;

  // Keyboard Events
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyDownCapture?: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyPress?: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyPressCapture?: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyUpCapture?: KeyboardEventHandler<HTMLTextAreaElement>;
}

export function MultilineTextField(props: MultilineTextFieldProps) {
  return (
    <textarea
      placeholder={props.placeholder}
      disabled={props.disabled ?? false}
      className={cn(
        "border-grey-600 bg-grey-0 text-grey-800 shadow-pixel placeholder:text-grey-400 disabled:bg-grey-100 disabled:text-grey-600 inline-flex resize-none gap-2 border px-2 py-1 font-serif select-none disabled:shadow-none",
        props.class
      )}
      value={props.value}
      onInput={(e) => props.onInput(e.currentTarget.value)}
      rows={props.rows}
      readOnly={props.readOnly}
      ref={props.textareaRef}
      onKeyDown={props.onKeyDown}
      onKeyDownCapture={props.onKeyDownCapture}
      onKeyPress={props.onKeyPress}
      onKeyPressCapture={props.onKeyPressCapture}
      onKeyUp={props.onKeyUp}
      onKeyUpCapture={props.onKeyUpCapture}
    />
  );
}
