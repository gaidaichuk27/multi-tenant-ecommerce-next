import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ThemeSelector } from '@features/theme/themeSelector/ui/ThemeSelector';
import { ActiveThemeProvider } from '@providers/theme/ActiveThemeProvider';
import { Label } from '@shared/ui/Form/Label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from './Select';

type SelectStoryArgs = {
    triggerSize: 'default' | 'sm';
    position: 'item-aligned' | 'popper';
};

const FRUITS = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
] as const;

const meta = {
    title: 'Shared/ui/Form/Select',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        triggerSize: {
            control: 'select',
            options: ['default', 'sm'],
        },
        position: {
            control: 'select',
            options: ['item-aligned', 'popper'],
            description:
                'item-aligned: selected item aligns over trigger. popper: aligns to trigger edge.',
        },
    },
    args: {
        triggerSize: 'default',
        position: 'item-aligned',
    },
} satisfies Meta<SelectStoryArgs>;

export default meta;
type Story = StoryObj<SelectStoryArgs>;

function FruitSelect({
    triggerSize = 'default',
    position = 'item-aligned',
    className,
    placeholder = 'Select a fruit',
    defaultValue,
    disabled,
}: Partial<SelectStoryArgs> & {
    className?: string;
    placeholder?: string;
    defaultValue?: string;
    disabled?: boolean;
}) {
    return (
        <Select
            defaultValue={defaultValue}
            disabled={disabled}
        >
            <SelectTrigger
                size={triggerSize}
                className={className}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position={position}>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    {FRUITS.map((fruit) => (
                        <SelectItem
                            key={fruit.value}
                            value={fruit.value}
                        >
                            {fruit.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

/** @see https://ui.shadcn.com/docs/components/radix/select */
export const Default: Story = {
    render: ({ triggerSize, position }) => (
        <FruitSelect
            triggerSize={triggerSize}
            position={position}
            className="w-full max-w-48"
        />
    ),
};

export const Sm: Story = {
    args: {
        triggerSize: 'sm',
        position: 'item-aligned',
    },
    render: ({ triggerSize, position }) => (
        <FruitSelect
            triggerSize={triggerSize}
            position={position}
            className="w-full max-w-48"
        />
    ),
};

function AlignItemDemo({
    alignItemWithTrigger,
    triggerSize,
}: {
    alignItemWithTrigger: boolean;
    triggerSize: 'default' | 'sm';
}) {
    return (
        <div className="flex w-full max-w-xs flex-col gap-3">
            <p className="text-muted-foreground text-sm">
                {alignItemWithTrigger
                    ? 'position="item-aligned" — selected item aligns over the trigger.'
                    : 'position="popper" — menu aligns to the trigger edge.'}
            </p>
            <Select defaultValue="banana">
                <SelectTrigger size={triggerSize}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent
                    position={alignItemWithTrigger ? 'item-aligned' : 'popper'}
                >
                    <SelectGroup>
                        {FRUITS.map((fruit) => (
                            <SelectItem
                                key={fruit.value}
                                value={fruit.value}
                            >
                                {fruit.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

/** @see https://ui.shadcn.com/docs/components/radix/select#align-item-with-trigger */
export const AlignItemWithTrigger: Story = {
    render: ({ triggerSize }) => (
        <AlignItemDemo
            alignItemWithTrigger
            triggerSize={triggerSize}
        />
    ),
};

export const AlignPopper: Story = {
    render: ({ triggerSize }) => (
        <AlignItemDemo
            alignItemWithTrigger={false}
            triggerSize={triggerSize}
        />
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/select#groups */
export const Groups: Story = {
    render: ({ triggerSize, position }) => (
        <Select>
            <SelectTrigger
                size={triggerSize}
                className="w-full max-w-48"
            >
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent position={position}>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Vegetables</SelectLabel>
                    <SelectItem value="carrot">Carrot</SelectItem>
                    <SelectItem value="broccoli">Broccoli</SelectItem>
                    <SelectItem value="spinach">Spinach</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/select#scrollable */
export const Scrollable: Story = {
    render: ({ triggerSize, position }) => (
        <Select>
            <SelectTrigger
                size={triggerSize}
                className="w-full max-w-64"
            >
                <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent position={position}>
                <SelectGroup>
                    <SelectLabel>North America</SelectLabel>
                    <SelectItem value="est">Eastern Standard Time</SelectItem>
                    <SelectItem value="cst">Central Standard Time</SelectItem>
                    <SelectItem value="mst">Mountain Standard Time</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time</SelectItem>
                    <SelectItem value="akst">Alaska Standard Time</SelectItem>
                    <SelectItem value="hst">Hawaii Standard Time</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Europe & Africa</SelectLabel>
                    <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
                    <SelectItem value="cet">Central European Time</SelectItem>
                    <SelectItem value="eet">Eastern European Time</SelectItem>
                    <SelectItem value="west">
                        Western European Summer Time
                    </SelectItem>
                    <SelectItem value="cat">Central Africa Time</SelectItem>
                    <SelectItem value="eat">East Africa Time</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Asia</SelectLabel>
                    <SelectItem value="msk">Moscow Time</SelectItem>
                    <SelectItem value="ist">India Standard Time</SelectItem>
                    <SelectItem value="cst_china">
                        China Standard Time
                    </SelectItem>
                    <SelectItem value="jst">Japan Standard Time</SelectItem>
                    <SelectItem value="kst">Korea Standard Time</SelectItem>
                    <SelectItem value="ist_indonesia">
                        Indonesia Central Standard Time
                    </SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>Australia & Pacific</SelectLabel>
                    <SelectItem value="awst">
                        Australian Western Standard Time
                    </SelectItem>
                    <SelectItem value="acst">
                        Australian Central Standard Time
                    </SelectItem>
                    <SelectItem value="aest">
                        Australian Eastern Standard Time
                    </SelectItem>
                    <SelectItem value="nzst">
                        New Zealand Standard Time
                    </SelectItem>
                    <SelectItem value="fjt">Fiji Time</SelectItem>
                </SelectGroup>
                <SelectGroup>
                    <SelectLabel>South America</SelectLabel>
                    <SelectItem value="art">Argentina Time</SelectItem>
                    <SelectItem value="bot">Bolivia Time</SelectItem>
                    <SelectItem value="brt">Brasilia Time</SelectItem>
                    <SelectItem value="clt">Chile Standard Time</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/select#disabled */
export const Disabled: Story = {
    render: ({ triggerSize, position }) => (
        <Select disabled>
            <SelectTrigger
                size={triggerSize}
                className="w-full max-w-48"
            >
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent position={position}>
                <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem
                        value="grapes"
                        disabled
                    >
                        Grapes
                    </SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/select#invalid */
export const Invalid: Story = {
    render: ({ triggerSize, position }) => (
        <div
            className="flex w-full max-w-48 flex-col gap-2"
            data-invalid
        >
            <Label htmlFor="fruit-invalid">Fruit</Label>
            <Select>
                <SelectTrigger
                    id="fruit-invalid"
                    size={triggerSize}
                    aria-invalid
                >
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent position={position}>
                    <SelectGroup>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <p className="text-destructive text-sm">Please select a fruit.</p>
        </div>
    ),
};

/** Theme picker from usage docs. */
export const Theme: Story = {
    render: ({ triggerSize, position }) => (
        <Select defaultValue="system">
            <SelectTrigger
                size={triggerSize}
                className="w-[180px]"
            >
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent position={position}>
                <SelectGroup>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

/** App usage: header theme selector. */
export const ThemeSelectorExample: Story = {
    render: () => <ThemeSelector />,
    decorators: [
        (Story) => (
            <ActiveThemeProvider initialTheme="default">
                <Story />
            </ActiveThemeProvider>
        ),
    ],
};
