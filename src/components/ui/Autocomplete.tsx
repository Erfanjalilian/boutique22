"use client";

import { cn } from "@/utils/helpers";
import { useState, useRef, useEffect, useMemo } from "react";

interface AutocompleteProps {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export function Autocomplete({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  error,
  className,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync input value when value prop changes externally
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return options;
    const search = inputValue.trim().toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(search));
  }, [options, inputValue]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightIndex(-1);
    if (!newValue.trim()) {
      onChange("");
    }
  }

  function handleSelect(option: string) {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
    setHighlightIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  }

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-muted">
          {label}
          {required && <span className="text-red-400 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl bg-card border border-border px-4 py-2.5 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
            error && "border-red-500 focus:ring-red-500/50",
            className
          )}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-50 mt-1 w-full rounded-xl bg-card border border-border shadow-lg max-h-60 overflow-auto"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-2.5 text-sm text-muted text-center">
                نتیجه‌ای یافت نشد
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option}
                  role="option"
                  aria-selected={highlightIndex === index}
                  className={cn(
                    "px-4 py-2.5 text-sm cursor-pointer transition-colors",
                    highlightIndex === index
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-accent",
                    value === option && "font-medium text-primary"
                  )}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightIndex(index)}
                >
                  {option}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}