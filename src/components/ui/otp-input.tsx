import { ChangeEvent, useRef, ClipboardEvent } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface OTPInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "maxLength" | "onChange"
  > {
  digitsLength?: number;
  value: string;
  onChange: (value: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  className,
  onChange,
  value,
  digitsLength = 6,
  ...props
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const { value } = event.target;
    const regex = new RegExp("[^0-9]", "g");

    // Return if not a digit
    if (regex.test(value)) return;
    // Move focus to the next input if digit is entered
    if (value && index < digitsLength - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Move focus to previous input in backspace press
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    const digits = inputRefs.current.map((el) => el.value).join("");
    onChange(digits);
  }

  function handleInputPaste(event: ClipboardEvent<HTMLInputElement>) {
    const value = event.clipboardData.getData("text");
    const regex = new RegExp("[^0-9]", "g");

    // Return if not a digit
    if (regex.test(value)) return;

    // Set the pasted values in input fields
    value.split("").forEach((digit, index) => {
      if (index < digitsLength) {
        inputRefs.current[index].value = digit;
      }
    });

    // Move focus to the last pasted input field
    if (value.length > 0 && value.length <= digitsLength) {
      inputRefs.current[value.length - 1].focus();
    } else if (value.length > digitsLength) {
      inputRefs.current[digitsLength - 1].focus();
    }

    onChange(value);
  }

  return (
    <div className="flex flex-row items-center justify-center flex-nowrap gap-x-4">
      {Array.from({ length: digitsLength }, (_, index) => (
        <Input
          data-testid="otp-input"
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={(el) => (inputRefs.current[index] = el!)}
          onChange={(event) => handleInputChange(event, index)}
          value={value[index] || ""}
          onPaste={handleInputPaste}
          className={cn("text-center w-12 h-12 text-lg", className)}
          {...props}
        />
      ))}
    </div>
  );
};
OTPInput.displayName = "OTPInput";

export { OTPInput };
