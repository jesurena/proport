'use client';

import React from 'react';
import { Popover, ConfigProvider } from 'antd';
import type { PopoverProps } from 'antd';
import { cn } from '../../utils/cn';

export interface AppPopoverProps extends PopoverProps {
    children: React.ReactNode;
}

export const AppPopover: React.FC<AppPopoverProps> = ({
    children,
    overlayClassName,
    overlayStyle,
    overlayInnerStyle,
    placement = 'top',
    trigger = 'click',
    ...props
}) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Popover: {
                        colorBgElevated: 'var(--neutral)',
                        colorText: 'var(--foreground)',
                        borderRadiusOuter: 16,
                        borderRadiusLG: 16,
                    },
                },
            }}
        >
            <Popover
                placement={placement}
                trigger={trigger}
                overlayClassName={cn('app-popover !p-0', overlayClassName)}
                overlayStyle={{
                    padding: 0,
                    ...overlayStyle,
                }}
                styles={{
                    container: {
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // shadow-xl style
                        padding: 0,
                        overflow: 'hidden',
                        ...overlayInnerStyle,
                    }
                }}
                {...props}
            >
                {children}
            </Popover>
        </ConfigProvider>
    );
};
