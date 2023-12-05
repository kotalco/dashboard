import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/form/form-errors";

import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import Link from "next/link";

export type OptionType = Record<"value" | "label", string>;

interface MultiSelectProps {
  id: string;
  options: OptionType[];
  className?: string;
  placeholder?: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
  disabled?: boolean;
  defaultValue?: string[] | null;
  allowCustomValues?: boolean;
  link?: { title: string; href: string };
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      className,
      id,
      label,
      errors,
      disabled,
      defaultValue,
      allowCustomValues,
      link,
      ...props
    },
    ref
  ) => {
    const { pending } = useFormStatus();
    const [inputValue, setInputValue] = React.useState("");
    const [open, setOpen] = React.useState(false);
    // Initialize selected with defaultValue if provided and not null
    const [selected, setSelected] = React.useState<OptionType[]>(
      defaultValue
        ? defaultValue.map(
            (value) =>
              options.find((option) => option.value === value) || {
                value,
                label: value,
              }
          )
        : []
    );

    // Handle defaultValue prop changes
    React.useEffect(() => {
      if (defaultValue) {
        setSelected(
          defaultValue.map(
            (value) =>
              options.find((option) => option.value === value) || {
                value,
                label: value,
              }
          )
        );
      } else if (defaultValue === null) {
        setSelected([]);
      }
    }, [defaultValue, options]);

    // on delete key press, remove last selected item
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && selected.length > 0) {
          setSelected(
            selected.filter((_, index) => index !== selected.length - 1)
          );
        }

        // close on escape
        if (e.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [setSelected, selected]);

    const handleUnselect = (item: OptionType) => {
      setSelected(selected.filter((i) => i.value !== item.value));
    };

    const handleAddCustomValue = () => {
      if (inputValue.trim() && allowCustomValues) {
        const newValue = { value: inputValue, label: inputValue };
        if (!selected.some((item) => item.value === inputValue)) {
          setSelected([...selected, newValue]);
          setInputValue("");
        }
      }
    };

    return (
      <div className="space-y-2">
        <div className="space-y-2">
          {label && (
            <Label
              htmlFor={id}
              className="font-semibold block text-neutral-700"
            >
              {label}
            </Label>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className={className}>
              <Button
                disabled={pending || disabled}
                ref={ref}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`group w-full bg-white hover:bg-white justify-between ${
                  selected.length > 1 ? "h-full" : "h-10"
                }`}
                onClick={() => setOpen(!open)}
              >
                <div className="flex flex-wrap items-center gap-1">
                  {selected.map((item) => (
                    <React.Fragment key={item.value}>
                      <input type="hidden" value={item.value} name={id} />
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 group-hover:bg-background"
                        onClick={() => handleUnselect(item)}
                      >
                        {item.label}
                        <Button
                          asChild
                          disabled={pending || disabled}
                          variant="outline"
                          size="icon"
                          className="border-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUnselect(item);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUnselect(item);
                          }}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </Button>
                      </Badge>
                    </React.Fragment>
                  ))}
                  {selected.length === 0 && (
                    <span>{props.placeholder ?? "Select ..."}</span>
                  )}
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]">
              <Command className={className}>
                <CommandInput
                  disabled={pending || disabled}
                  placeholder={
                    allowCustomValues
                      ? "Search or type your own then press Enter"
                      : "Search ..."
                  }
                  value={inputValue}
                  onValueChange={setInputValue}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomValue();
                    }
                  }}
                />
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setSelected(
                          selected.some((item) => item.value === option.value)
                            ? selected.filter(
                                (item) => item.value !== option.value
                              )
                            : [...selected, option]
                        );
                        setOpen(true);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.some((item) => item.value === option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}

                  {link && (
                    <Link
                      href={link.href}
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      {link.title}
                    </Link>
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
