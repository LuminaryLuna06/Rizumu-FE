import React, { useState, useRef, useEffect } from "react";
import { IconChevronDown, IconX, IconCheck } from "@tabler/icons-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "default" | "filled" | "unstyled";
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  data: string[] | SelectOption[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  searchable?: boolean;
  clearable?: boolean;
  nothingFoundMessage?: string;
  maxDropdownHeight?: number;
  className?: string;
}

function SelectInput({
  label,
  description,
  error,
  size = "md",
  radius = "md",
  variant = "default",
  disabled = false,
  required = false,
  placeholder = "Pick value",
  data = [],
  value = null,
  onChange,
  searchable = false,
  clearable = false,
  nothingFoundMessage = "No options",
  maxDropdownHeight = 250,
  className = "",
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Convert data to SelectOption format
  const options: SelectOption[] = data.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item
  );

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected option
  const selectedOption = options.find((opt) => opt.value === value);

  const sizeClasses = {
    xs: "h-[30px] text-xs px-[8px]",
    sm: "h-[36px] text-sm px-[10px]",
    md: "h-[42px] text-base px-[12px]",
    lg: "h-[50px] text-lg px-[16px]",
    xl: "h-[60px] text-xl px-[20px]",
  };
  const iconSizeClasses = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  };
  const radiusClasses = {
    sm: "rounded-[var(--radius-sm)]",
    md: "rounded-[var(--radius-md)]",
    lg: "rounded-[var(--radius-lg)]",
    xl: "rounded-[var(--radius-xl)]",
    full: "rounded-[var(--radius-full)]",
  };
  const variantClasses = {
    default: `border border-white/20 bg-white/5 text-white placeholder:text-white/40
      focus:border-white/50 focus:bg-white/8
      hover:bg-white/8 hover:border-white/30`,
    filled: `border border-transparent bg-white/10 text-white placeholder:text-white/40
      focus:border-white/30 focus:bg-white/12
      hover:bg-white/12`,
    unstyled: "border-none bg-transparent text-white placeholder:text-white/40",
  };
  const errorClasses = error
    ? "border-red-500 focus:border-red-500 hover:border-red-500"
    : "";
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed bg-white/5 hover:bg-white/5"
    : "cursor-pointer";
  const labelSizeClasses = {
    xs: "text-xs mb-[4px]",
    sm: "text-sm mb-[4px]",
    md: "text-sm mb-[6px]",
    lg: "text-base mb-[6px]",
    xl: "text-lg mb-[8px]",
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled || disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(0);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    setSearchQuery("");
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions.length]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      highlightedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  return (
    <div className={`flex flex-col ${className}`} ref={containerRef}>
      {label && (
        <label
          className={`font-medium text-secondary/70 ${labelSizeClasses[size]} ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {description && (
        <div className="text-xs text-white/60 mb-[6px]">{description}</div>
      )}

      {/* Select Input */}
      <div className="relative">
        <div
          className={`
            w-full flex items-center justify-between
            ${sizeClasses[size]}
            ${radiusClasses[radius]}
            ${variant !== "unstyled" ? variantClasses[variant] : ""}
            ${errorClasses}
            ${disabledClasses}
            outline-none
            transition-all duration-[var(--transition-fast)]
            font-[var(--font-inter)]
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span
            className={`flex-1 truncate ${
              selectedOption ? "text-white" : "text-white/40"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="flex items-center gap-1">
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-white/60 hover:text-white transition-colors"
              >
                <IconX size={iconSizeClasses[size]} />
              </button>
            )}
            <IconChevronDown
              size={iconSizeClasses[size]}
              className={`text-white/60 transition-transform duration-[var(--transition-fast)] ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className={`
              absolute left-0 right-0 top-full mt-1
              z-dropdown
              ${radiusClasses[radius]}
              border border-white/20
              bg-primary backdrop-blur-xl
              shadow-lg
              overflow-hidden
            `}
          >
            {searchable && (
              <div className="p-2 border-b border-white/10">
                <input
                  ref={inputRef}
                  type="text"
                  className={`
                    w-full
                    ${sizeClasses[size]}
                    ${radiusClasses[radius]}
                    border border-white/20 bg-white/5 text-white placeholder:text-white/40
                    focus:border-white/50 focus:bg-white/8
                    outline-none
                    transition-all duration-[var(--transition-fast)]
                    font-[var(--font-inter)]
                  `}
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            )}

            {/* Options list */}
            <div
              className="overflow-y-auto custom-scrollbar scrollbar-hidden"
              style={{ maxHeight: `${maxDropdownHeight}px` }}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-white/40 text-center">
                  {nothingFoundMessage}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    data-index={index}
                    className={`
                      px-3 py-2 text-sm
                      cursor-pointer
                      transition-all duration-[var(--transition-fast)]
                      flex items-center justify-between
                      ${
                        option.disabled
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-white/10"
                      }
                      ${index === highlightedIndex ? "bg-white/10" : ""}
                      ${
                        option.value === value
                          ? "text-white font-medium"
                          : "text-white/80"
                      }
                    `}
                    onClick={() => handleSelect(option)}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <IconCheck
                        size={iconSizeClasses[size]}
                        className="ml-2 flex-shrink-0"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-500 mt-[6px] font-medium">{error}</div>
      )}
    </div>
  );
}

export default SelectInput;
