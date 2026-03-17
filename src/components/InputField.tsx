"use client";

import { useId } from "react";
import { cn } from "@/components/cn";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "decimal" | "numeric";
  placeholder?: string;
  helperText?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
};

export function InputField(props: Props) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label className="label" htmlFor={id}>
        {props.label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={props.name}
          className={cn("input pr-10")}
          inputMode={props.inputMode ?? "decimal"}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          min={props.min}
          max={props.max}
          step={props.step}
          required={props.required}
          aria-describedby={props.helperText ? `${id}-help` : undefined}
        />
        {props.suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            {props.suffix}
          </span>
        ) : null}
      </div>
      {props.helperText ? (
        <p id={`${id}-help`} className="muted">
          {props.helperText}
        </p>
      ) : null}
    </div>
  );
}

