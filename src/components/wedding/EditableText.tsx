import { useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  editMode: boolean;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

const EditableText = ({
  value,
  onChange,
  editMode,
  tag: Tag = "p",
  className = "",
  placeholder = "Haz clic para editar...",
  multiline = false,
}: Props) => {
  const ref = useRef<HTMLElement>(null);

  // Sync external value changes only when the element is not focused
  // (avoids cursor reset while the user is actively typing)
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = value || "";
    }
  }, [value]);

  if (!editMode) {
    return <Tag className={className}>{value || ""}</Tag>;
  }

  const handleInput = () => {
    if (ref.current) {
      onChange(ref.current.textContent || "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`${className} outline-none ring-2 ring-primary/30 ring-offset-2 ring-offset-background rounded-sm cursor-text transition-shadow hover:ring-primary/50 focus:ring-primary/70 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50`}
      data-placeholder={placeholder}
      style={{ minWidth: "2rem" }}
    />
  );
};

export default EditableText;
