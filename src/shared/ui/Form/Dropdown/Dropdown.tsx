import * as React from 'react';
import { cva } from 'class-variance-authority';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

import { cn } from '@lib/utils';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';

type DropdownMenuSize = 'default' | 'sm';

const DropdownMenuSizeContext =
    React.createContext<DropdownMenuSize>('default');

function useDropdownMenuSize() {
    return React.useContext(DropdownMenuSizeContext);
}

const dropdownMenuContentVariants = cva(
    'bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto shadow-md ring-1 duration-100 data-[state=closed]:overflow-hidden',
    {
        variants: {
            size: {
                default: 'min-w-32 rounded-lg p-1',
                sm: 'min-w-28 rounded-md p-0.5',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
);

const dropdownMenuItemVariants = cva(
    'group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:*:[svg]:text-destructive',
    {
        variants: {
            size: {
                default:
                    "gap-1.5 rounded-md px-1.5 py-1 text-sm data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4",
                sm: "gap-1 rounded-md px-1 py-0.5 text-xs data-inset:pl-6 [&_svg:not([class*='size-'])]:size-3.5",
            },
            variant: {
                default: '',
                destructive: '',
            },
        },
        defaultVariants: {
            size: 'default',
            variant: 'default',
        },
    },
);

const dropdownMenuLabelVariants = cva('text-muted-foreground font-medium', {
    variants: {
        size: {
            default: 'px-1.5 py-1 text-xs data-inset:pl-7',
            sm: 'px-1 py-0.5 text-[0.65rem] data-inset:pl-6',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

function DropdownMenu({
    size = 'default',
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root> & {
    size?: DropdownMenuSize;
}) {
    return (
        <DropdownMenuSizeContext.Provider value={size}>
            <DropdownMenuPrimitive.Root
                data-slot="dropdown-menu"
                data-size={size}
                {...props}
            />
        </DropdownMenuSizeContext.Provider>
    );
}

function DropdownMenuPortal({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
    return (
        <DropdownMenuPrimitive.Portal
            data-slot="dropdown-menu-portal"
            {...props}
        />
    );
}

function DropdownMenuTrigger({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
    return (
        <DropdownMenuPrimitive.Trigger
            data-slot="dropdown-menu-trigger"
            {...props}
        />
    );
}

function DropdownMenuContent({
    className,
    align = 'start',
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
    const size = useDropdownMenuSize();

    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                data-size={size}
                sideOffset={sideOffset}
                align={align}
                className={cn(dropdownMenuContentVariants({ size }), className)}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    );
}

function DropdownMenuGroup({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
    return (
        <DropdownMenuPrimitive.Group
            data-slot="dropdown-menu-group"
            {...props}
        />
    );
}

function DropdownMenuItem({
    className,
    inset,
    variant = 'default',
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
}) {
    const size = useDropdownMenuSize();

    return (
        <DropdownMenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            data-size={size}
            className={cn(
                dropdownMenuItemVariants({ size, variant }),
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
    inset?: boolean;
}) {
    const size = useDropdownMenuSize();

    return (
        <DropdownMenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            data-size={size}
            className={cn(
                dropdownMenuItemVariants({ size, variant: 'default' }),
                size === 'default' ? 'pr-8 pl-1.5' : 'pr-7 pl-1',
                className,
            )}
            checked={checked}
            {...props}
        >
            <span
                className="pointer-events-none absolute right-2 flex items-center justify-center"
                data-slot="dropdown-menu-checkbox-item-indicator"
            >
                <DropdownMenuPrimitive.ItemIndicator>
                    <CheckIcon
                        className={size === 'sm' ? 'size-3.5' : 'size-4'}
                    />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
}

function DropdownMenuRadioGroup({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
    return (
        <DropdownMenuPrimitive.RadioGroup
            data-slot="dropdown-menu-radio-group"
            {...props}
        />
    );
}

function DropdownMenuRadioItem({
    className,
    children,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
    inset?: boolean;
}) {
    const size = useDropdownMenuSize();

    return (
        <DropdownMenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            data-size={size}
            className={cn(
                dropdownMenuItemVariants({ size, variant: 'default' }),
                size === 'default' ? 'pr-8 pl-1.5' : 'pr-7 pl-1',
                className,
            )}
            {...props}
        >
            <span
                className="pointer-events-none absolute right-2 flex items-center justify-center"
                data-slot="dropdown-menu-radio-item-indicator"
            >
                <DropdownMenuPrimitive.ItemIndicator>
                    <CheckIcon
                        className={size === 'sm' ? 'size-3.5' : 'size-4'}
                    />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
}) {
    const size = useDropdownMenuSize();

    return (
        <DropdownMenuPrimitive.Label
            data-slot="dropdown-menu-label"
            data-inset={inset}
            data-size={size}
            className={cn(dropdownMenuLabelVariants({ size }), className)}
            {...props}
        />
    );
}

function DropdownMenuSeparator({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
    const size = useDropdownMenuSize();

    return (
        <DropdownMenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            data-size={size}
            className={cn(
                'bg-border h-px',
                size === 'default' ? '-mx-1 my-1' : '-mx-0.5 my-0.5',
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuShortcut({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    const size = useDropdownMenuSize();

    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn(
                'text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground ml-auto tracking-widest',
                size === 'default' ? 'text-xs' : 'text-[0.65rem]',
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuSub({
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
    return (
        <DropdownMenuPrimitive.Sub
            data-slot="dropdown-menu-sub"
            {...props}
        />
    );
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}) {
    const size = useDropdownMenuSize();

    return (
        <DropdownMenuPrimitive.SubTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            data-size={size}
            className={cn(
                dropdownMenuItemVariants({ size, variant: 'default' }),
                'data-open:bg-accent data-open:text-accent-foreground',
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon
                className={cn('ml-auto', size === 'sm' ? 'size-3.5' : 'size-4')}
            />
        </DropdownMenuPrimitive.SubTrigger>
    );
}

function DropdownMenuSubContent({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
    const size = useDropdownMenuSize();

    return (
        <DropdownMenuPrimitive.SubContent
            data-slot="dropdown-menu-sub-content"
            data-size={size}
            className={cn(
                'bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-50 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden shadow-lg ring-1 duration-100',
                size === 'default'
                    ? 'min-w-[96px] rounded-lg p-1'
                    : 'min-w-[88px] rounded-md p-0.5',
                className,
            )}
            {...props}
        />
    );
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    dropdownMenuItemVariants,
};
export type { DropdownMenuSize };
