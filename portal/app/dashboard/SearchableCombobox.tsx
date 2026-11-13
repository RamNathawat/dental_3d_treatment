"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, X, Sparkles } from "lucide-react";

export interface ComboboxItem {
  id: string;
  name: string;
  subtitle?: string;
  badge?: string;
  searchTerms?: string[];
  raw?: any;
}

interface SearchableComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (item: ComboboxItem) => void;
  items: ComboboxItem[];
  placeholder?: string;
  icon?: React.ReactNode;
  entityName: string; // e.g. "Clinic" or "Doctor"
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function SearchableCombobox({
  value,
  onChange,
  onSelect,
  items,
  placeholder,
  icon,
  entityName,
  disabled = false,
  required = false,
  autoFocus = false,
  className = "",
}: SearchableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter items based on current value typed
  const query = value.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    if (!query) return items;
    return items.filter((item) => {
      if (item.name.toLowerCase().includes(query)) return true;
      if (item.badge && item.badge.toLowerCase().includes(query)) return true;
      if (item.subtitle && item.subtitle.toLowerCase().includes(query)) return true;
      if (item.searchTerms) {
        return item.searchTerms.some((term) => term.toLowerCase().includes(query));
      }
      return false;
    });
  }, [items, query]);

  // Check if current typed value exactly matches an existing item name
  const exactMatch = useMemo(() => {
    if (!query) return null;
    return items.find(
      (item) => item.name.trim().toLowerCase() === query
    );
  }, [items, query]);

  const showAddNewOption = query.length > 0 && !exactMatch;

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  function handleSelect(item: ComboboxItem) {
    onChange(item.name);
    if (onSelect) onSelect(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleAddNew(customName: string) {
    onChange(customName);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setIsOpen(true);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }
    }

    const totalOptions = filteredItems.length + (showAddNewOption ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalOptions ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalOptions - 1));
    } else if (e.key === "Enter") {
      // Prevent form submit
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
        handleSelect(filteredItems[highlightedIndex]);
      } else if (highlightedIndex === filteredItems.length && showAddNewOption) {
        handleAddNew(value.trim());
      } else if (filteredItems.length === 1) {
        handleSelect(filteredItems[0]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className={`relative min-w-0 w-full ${className}`}>
      {/* Input Box */}
      <div className="relative flex items-center min-w-0">
        {icon && (
          <div className="absolute left-3 text-slate-400 dark:text-[#ffd166] pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || `Type or select ${entityName}...`}
          className={`w-full ${
            icon ? "pl-9" : "pl-3.5"
          } pr-16 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D121D] text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium disabled:opacity-50 min-w-0`}
        />

        {/* Right Action Icons: Clear & Chevron */}
        <div className="absolute right-2 flex items-center gap-0.5 text-slate-400 dark:text-slate-500">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear text"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              } else {
                setIsOpen(true);
                inputRef.current?.focus();
              }
            }}
            className="p-1 rounded-lg hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Toggle ${entityName} list`}
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-150 ${
                isOpen ? "rotate-180 text-amber-500 dark:text-[#ffd166]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Floating Filtered Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#131A26] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 py-1"
          >
            {filteredItems.map((item, index) => {
              const isHighlighted = highlightedIndex === index;
              const isSelected =
                item.name.trim().toLowerCase() === value.trim().toLowerCase();

              return (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(item)}
                  className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between gap-2 transition-colors ${
                    isHighlighted
                      ? "bg-amber-500/10 text-amber-900 dark:text-[#ffd166]"
                      : isSelected
                      ? "bg-amber-500/5 text-slate-900 dark:text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold truncate">{item.name}</span>
                      {item.badge && (
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166] flex-shrink-0" />
                  )}
                </li>
              );
            })}

            {/* "+ Add New ..." Option when query does not match exactly */}
            {showAddNewOption && (
              <li
                role="option"
                onMouseEnter={() => setHighlightedIndex(filteredItems.length)}
                onClick={() => handleAddNew(value.trim())}
                className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between gap-2 transition-colors ${
                  highlightedIndex === filteredItems.length
                    ? "bg-amber-500/15 text-amber-900 dark:text-[#ffd166]"
                    : "bg-slate-50/50 dark:bg-slate-900/30 text-amber-700 dark:text-[#ffd166] hover:bg-amber-500/10"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-[#ffd166] flex-shrink-0" />
                  <span className="truncate">
                    Create new {entityName.toLowerCase()}:{" "}
                    <strong>&quot;{value.trim()}&quot;</strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-[#ffd166] flex-shrink-0">
                  + New
                </span>
              </li>
            )}

            {/* Empty State when no stored items at all */}
            {items.length === 0 && !query && (
              <li className="px-3 py-3 text-center text-slate-400 dark:text-slate-500 text-xs">
                No saved {entityName.toLowerCase()}s yet. Start typing to create one.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
