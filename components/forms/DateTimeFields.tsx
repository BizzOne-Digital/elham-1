"use client";

import type { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";
import { FieldLabel, TextInput } from "./shared";

interface DateTimeFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  dateField?: Path<T>;
  timeField?: Path<T>;
  required?: boolean;
}

function openPicker(event: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  if (typeof input.showPicker === "function") {
    try {
      input.showPicker();
    } catch {
      // Some browsers restrict showPicker outside direct user gestures.
    }
  }
}

export function DateTimeFields<T extends FieldValues>({
  register,
  errors,
  dateField = "preferredDate" as Path<T>,
  timeField = "preferredTime" as Path<T>,
  required = false,
}: DateTimeFieldsProps<T>) {
  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <FieldLabel htmlFor={`field-${String(dateField)}`}>
          Preferred date{required ? "" : " (optional)"}
        </FieldLabel>
        <TextInput
          id={`field-${String(dateField)}`}
          type="date"
          min={minDate}
          className="date-time-input cursor-pointer"
          error={errors[dateField]?.message as string | undefined}
          onClick={openPicker}
          onFocus={openPicker}
          {...register(dateField, { required: required ? "Please choose a date" : false })}
        />
      </div>
      <div>
        <FieldLabel htmlFor={`field-${String(timeField)}`}>
          Preferred time{required ? "" : " (optional)"}
        </FieldLabel>
        <TextInput
          id={`field-${String(timeField)}`}
          type="time"
          className="date-time-input cursor-pointer"
          error={errors[timeField]?.message as string | undefined}
          onClick={openPicker}
          onFocus={openPicker}
          {...register(timeField, { required: required ? "Please choose a time" : false })}
        />
      </div>
    </div>
  );
}
