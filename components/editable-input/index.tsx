import { useState } from "react";

interface EditableInputProps {
  value: string;
  onSave: (val: string) => void;
}

export function EditableInput({ value, onSave }: EditableInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [editing, setEditing] = useState(false);

  return (
    <input
      type="text"
      value={localValue}
      onFocus={() => setEditing(true)}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => {
        if (localValue !== value) onSave(localValue);
        setEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (localValue !== value) onSave(localValue);
          setEditing(false);
          (e.target as HTMLInputElement).blur();
        }
      }}
      className={`border rounded-md px-2 py-1 w-20 ${
        editing ? "bg-gray-50" : ""
      }`}
    />
  );
}
