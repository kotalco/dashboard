import { ChangeEvent, useRef, ClipboardEvent } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { InputProps } from "@/components/form/input";
import { FormErrors } from "@/components/form/form-errors";

export interface OTPInputProps
  extends Omit<InputProps, "label" | "description"> {
  digitsLength?: number;
}

const OTPInput: React.FC<OTPInputProps> = ({
  className,
  digitsLength = 6,
  id,
  errors,
  disabled,
  ...props
}) => {
  const { pending } = useFormStatus();
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
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center flex-nowrap gap-x-4">
        {Array.from({ length: digitsLength }, (_, index) => (
          <Input
            name={id}
            data-testid="otp-input"
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el!)}
            onChange={(event) => handleInputChange(event, index)}
            onPaste={handleInputPaste}
            className={cn("text-center w-12 h-12 text-lg", className)}
            disabled={pending || disabled}
            {...props}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <FormErrors errors={errors} id={id} />
      </div>
    </>
  );
};
OTPInput.displayName = "OTPInput";

export { OTPInput };
