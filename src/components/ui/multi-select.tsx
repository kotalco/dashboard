import { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type Option = { label: string; value: string };

interface MultiSelectProps {
  options: Option[];
  defaultValue?: string[];
  placeholder?: string;
  onChange?: (value: string[]) => void;
  value: string[];
  allowCustomValues?: boolean;
  emptyText?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  defaultValue,
  options,
  placeholder,
  onChange,
  value = [],
  allowCustomValues,
  emptyText,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback(
    (option: Option) => {
      setSelected((prev) => prev.filter((s) => s !== option));
      onChange && onChange(value.filter((val) => val !== option.value));
    },
    [onChange, value]
  );

  const handleAddNewValue = (option: Option) => {
    setInputValue("");
    setSelected((prev) => [...prev, option]);
    onChange && onChange([...value, option.value]);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;

      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
            const newValue = [...value];
            newValue.pop();
            onChange && onChange(newValue);
          }
        }

        if (e.key === "Escape") {
          input.blur();
        }

        if (e.key === "Enter" && input.value && allowCustomValues) {
          setSelected((prev) => [
            ...prev,
            { label: input.value, value: input.value },
          ]);
          onChange && onChange([...value, input.value]);
          setInputValue("");
        }
      }
    },
    [allowCustomValues, onChange, value]
  );

  const selectables = options.filter(
    (option) => !selected.some((s) => s.value === option.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option) => (
            <Badge key={option.value} variant="secondary">
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && !allowCustomValues && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            {!!options.length && <CommandEmpty>{emptyText}</CommandEmpty>}
            {!options.length && (
              <div className="py-6 text-center text-sm">{emptyText}</div>
            )}
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      setSelected((prev) => [...prev, option]);
                      onChange && onChange([...value, option.value]);
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        )}

        {open && allowCustomValues && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            {!!options.length && (
              <CommandEmpty className="py-2 px-3 text-left text-sm">
                {inputValue || emptyText}
              </CommandEmpty>
            )}
            {!options.length && (
              <div className="py-2 px-3 text-left text-sm">
                {inputValue || emptyText}
              </div>
            )}
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      handleAddNewValue(option);
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  );
};
export { MultiSelect };
