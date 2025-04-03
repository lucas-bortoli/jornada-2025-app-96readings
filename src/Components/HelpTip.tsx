import { KeyboardEvent, PropsWithChildren, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../Lib/class_names";
import SpriteIcon from "./SpriteIcon";

interface HelpTipProps extends PropsWithChildren {
  title: string;
  className?: string;
  iconClassName?: string;
}

export default function HelpTip(props: HelpTipProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  const [isOpen, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (!iconRef.current || !articleRef.current) return;

    const iconBoundary = iconRef.current.getBoundingClientRect();
    const articleBoundary = articleRef.current.getBoundingClientRect();

    console.log({ iconBoundary, articleBoundary });

    let x = 0;
    let y = iconBoundary.top + iconBoundary.height / 2;
    if (iconBoundary.left >= innerWidth / 2) {
      x = iconBoundary.right - articleBoundary.width - iconBoundary.width / 2;
    } else {
      x = iconBoundary.left + iconBoundary.width / 2;
    }

    x = Math.min(Math.max(x, 0), innerWidth - articleBoundary.width);
    y = Math.min(Math.max(y, 0), innerHeight - articleBoundary.height);

    articleRef.current.style.top = `${y}px`;
    articleRef.current.style.left = `${x}px`;
  });

  function open() {
    setOpen(true);
    requestAnimationFrame(() => articleRef.current?.focus());
  }

  function close() {
    setOpen(false);
  }

  function onKeyboardDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else {
      open();
    }
  }

  return (
    <div
      className={cn("relative inline-block cursor-pointer", props.className)}
      tabIndex={0}
      onFocus={open}
      onBlur={close}
      onKeyDown={onKeyboardDown}
      ref={iconRef}>
      <SpriteIcon name="Question16" className={props.iconClassName} />
      {isOpen &&
        createPortal(
          <article
            className="border-grey-800 bg-grey-0 shadow-pixel-sm fixed w-full max-w-72 cursor-default border p-2 text-sm !outline-none select-none"
            ref={articleRef}>
            <h1 className="font-medium">{props.title}</h1>
            {props.children}
          </article>,
          document.body
        )}
    </div>
  );
}
