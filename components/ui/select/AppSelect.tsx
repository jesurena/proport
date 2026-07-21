'use client';

import React from 'react';
import { Select } from 'antd';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';
import { AppField } from '../inputs/AppField';
import AppEmptyState from '../empty-state/AppEmptyState';

export interface AppSelectOption {
    value: string | number;
    label: React.ReactNode;
}

export interface AppSelectProps {
    value?: any;
    mode?: 'multiple' | 'tags';
    onChange?: (value: any) => void;
    options: AppSelectOption[];
    placeholder?: string;
    showSearch?: boolean;
    onSearch?: (value: string) => void;
    className?: string;
    disabled?: boolean;
    label?: React.ReactNode;
    labelRight?: React.ReactNode;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    required?: boolean;
    notFoundImageSrc?: string;
    notFoundTitle?: string;
    notFoundDescription?: string;
    variant?: 'default' | 'borderless';
}

export const AppSelect = ({
    value,
    onChange,
    options = [],
    placeholder,
    showSearch = false,
    onSearch,
    className,
    disabled = false,
    label,
    labelRight,
    hint,
    error,
    required = false,
    notFoundImageSrc,
    notFoundTitle,
    notFoundDescription,
    variant = 'default',
    mode
}: AppSelectProps) => {
    const extractText = (node: React.ReactNode): string => {
        if (typeof node === 'string' || typeof node === 'number') {
            return String(node);
        }
        if (React.isValidElement(node) && node.props) {
            const props = node.props as any;
            if (props.children) {
                return React.Children.toArray(props.children)
                    .map(extractText)
                    .join('');
            }
        }
        return '';
    };

    const filterOption = (input: string, option?: any) => {
        if (!option) return false;

        const valStr = String(option.value).toLowerCase();
        if (valStr.includes(input.toLowerCase())) return true;

        try {
            const textContent = extractText(option.label).toLowerCase();
            return textContent.includes(input.toLowerCase());
        } catch {
            return false;
        }
    };

    const defaultPlaceholder = typeof label === 'string' ? `Select ${label.toLowerCase()}...` : 'Select option...';
    const resolvedPlaceholder = placeholder || defaultPlaceholder;
    const isBorderless = variant === 'borderless';

    return (
        <AppField
            label={label}
            labelRight={labelRight}
            hint={hint}
            error={error}
            required={required}
            className={className}
        >
            <Select
                value={value === '' ? undefined : value}
                onChange={onChange}
                options={options}
                placeholder={resolvedPlaceholder}
                showSearch={showSearch}
                onSearch={onSearch}
                disabled={disabled}
                filterOption={onSearch ? false : filterOption}
                variant={isBorderless ? 'borderless' : undefined}
                mode={mode}
                notFoundContent={
                    <AppEmptyState
                        title={notFoundTitle || "No options found"}
                        description={notFoundDescription}
                        imageSrc={notFoundImageSrc || "/aria-mascott-sad.svg"}
                        imageSize={120}
                        className="py-4 gap-1.5"
                    />
                }
                suffixIcon={
                    <ChevronDown
                        size={14}
                        className="text-foreground/40 shrink-0"
                    />
                }
                style={isBorderless ? {
                    border: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                    padding: 0,
                    height: 'auto',
                    minHeight: 0,
                    fontSize: '14px',
                    fontWeight: 400,
                } : undefined}
                className={cn(
                    "w-full transition-all",
                    isBorderless
                        ? "!border-none !shadow-none !bg-transparent !h-auto !p-0 !text-sm !font-normal"
                        : cn(
                            "h-11 rounded-xl",
                            "[&_.ant-select-selector]:!bg-neutral/50 [&_.ant-select-selector]:!border-border [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!px-3.5",
                            "hover:[&_.ant-select-selector]:!bg-neutral/80",
                            "focus-within:[&_.ant-select-selector]:!border-accent-1 focus-within:[&_.ant-select-selector]:!ring-2 focus-within:[&_.ant-select-selector]:!ring-accent-1/40",
                            "[&_.ant-select-selection-item]:!text-foreground [&_.ant-select-selection-item]:!leading-[42px] [&_.ant-select-selection-item]:!text-sm",
                            "[&_.ant-select-selection-placeholder]:!text-foreground/30 [&_.ant-select-selection-placeholder]:!leading-[42px] [&_.ant-select-selection-placeholder]:!text-sm",
                            "[&_.ant-select-selection-search-input]:!h-11 [&_.ant-select-selection-search]:!px-1.5"
                        ),
                    disabled && "opacity-40 pointer-events-none"
                )}
                classNames={{
                    popup: {
                        root: cn(
                            "!bg-neutral/95 !backdrop-blur-md !border !border-border !rounded-xl !shadow-xl !p-1",
                            "[&_.ant-select-item]:!rounded-lg [&_.ant-select-item]:!mx-1 [&_.ant-select-item]:!my-0.5 [&_.ant-select-item]:!px-3 [&_.ant-select-item]:!py-2 [&_.ant-select-item]:!text-sm [&_.ant-select-item]:!text-foreground",
                            "[&_.ant-select-item-option-selected]:!bg-accent-1/10 [&_.ant-select-item-option-selected]:!text-accent-1 [&_.ant-select-item-option-selected]:!font-semibold",
                            "[&_.ant-select-item-option-active]:!bg-foreground/10 [&_.ant-select-item-option-active]:!text-foreground",
                            "[&_.ant-select-item-empty]:!p-0"
                        )
                    }
                }}
            />
        </AppField>
    );
};
