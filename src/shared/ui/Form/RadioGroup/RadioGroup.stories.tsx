import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from '@shared/ui/Form/Label';
import { RadioGroup, RadioGroupItem } from './RadioGroup';

type RadioGroupStoryArgs = {
    defaultValue: string;
};

function FieldDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-muted-foreground text-sm">{children}</p>;
}

function RadioOption({
    value,
    id,
    label,
    description,
    disabled,
    invalid,
}: {
    value: string;
    id: string;
    label: string;
    description?: string;
    disabled?: boolean;
    invalid?: boolean;
}) {
    return (
        <div
            className="flex items-start gap-3"
            data-disabled={disabled || undefined}
            data-invalid={invalid || undefined}
        >
            <RadioGroupItem
                value={value}
                id={id}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                className={description ? 'mt-0.5' : undefined}
            />
            <div className="grid gap-1">
                <Label
                    htmlFor={id}
                    className={description ? 'font-normal' : undefined}
                >
                    {label}
                </Label>
                {description ? (
                    <FieldDescription>{description}</FieldDescription>
                ) : null}
            </div>
        </div>
    );
}

const meta = {
    title: 'Shared/ui/Form/RadioGroup',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        defaultValue: {
            control: 'select',
            options: ['default', 'comfortable', 'compact'],
        },
    },
    args: {
        defaultValue: 'comfortable',
    },
} satisfies Meta<RadioGroupStoryArgs>;

export default meta;
type Story = StoryObj<RadioGroupStoryArgs>;

/** @see https://ui.shadcn.com/docs/components/radix/radio-group */
export const Default: Story = {
    render: ({ defaultValue }) => (
        <RadioGroup
            defaultValue={defaultValue}
            className="w-fit"
        >
            <div className="flex items-center gap-3">
                <RadioGroupItem
                    value="default"
                    id="rg-default"
                />
                <Label htmlFor="rg-default">Default</Label>
            </div>
            <div className="flex items-center gap-3">
                <RadioGroupItem
                    value="comfortable"
                    id="rg-comfortable"
                />
                <Label htmlFor="rg-comfortable">Comfortable</Label>
            </div>
            <div className="flex items-center gap-3">
                <RadioGroupItem
                    value="compact"
                    id="rg-compact"
                />
                <Label htmlFor="rg-compact">Compact</Label>
            </div>
        </RadioGroup>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/radio-group#usage */
export const Usage: Story = {
    render: () => (
        <RadioGroup
            defaultValue="option-one"
            className="w-fit"
        >
            <div className="flex items-center gap-3">
                <RadioGroupItem
                    value="option-one"
                    id="option-one"
                />
                <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center gap-3">
                <RadioGroupItem
                    value="option-two"
                    id="option-two"
                />
                <Label htmlFor="option-two">Option Two</Label>
            </div>
        </RadioGroup>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/radio-group#description */
export const Description: Story = {
    render: () => (
        <RadioGroup
            defaultValue="comfortable"
            className="w-fit"
        >
            <RadioOption
                value="default"
                id="desc-r1"
                label="Default"
                description="Standard spacing for most use cases."
            />
            <RadioOption
                value="comfortable"
                id="desc-r2"
                label="Comfortable"
                description="More space between elements."
            />
            <RadioOption
                value="compact"
                id="desc-r3"
                label="Compact"
                description="Minimal spacing for dense layouts."
            />
        </RadioGroup>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/radio-group#choice-card */
export const ChoiceCard: Story = {
    render: () => (
        <RadioGroup
            defaultValue="plus"
            className="max-w-sm gap-3"
        >
            <Label
                htmlFor="plus-plan"
                className="hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 font-normal"
            >
                <div className="grid gap-1">
                    <span className="text-sm font-medium">Plus</span>
                    <FieldDescription>
                        For individuals and small teams.
                    </FieldDescription>
                </div>
                <RadioGroupItem
                    value="plus"
                    id="plus-plan"
                />
            </Label>
            <Label
                htmlFor="pro-plan"
                className="hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 font-normal"
            >
                <div className="grid gap-1">
                    <span className="text-sm font-medium">Pro</span>
                    <FieldDescription>For growing businesses.</FieldDescription>
                </div>
                <RadioGroupItem
                    value="pro"
                    id="pro-plan"
                />
            </Label>
            <Label
                htmlFor="enterprise-plan"
                className="hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg border p-4 font-normal"
            >
                <div className="grid gap-1">
                    <span className="text-sm font-medium">Enterprise</span>
                    <FieldDescription>
                        For large teams and enterprises.
                    </FieldDescription>
                </div>
                <RadioGroupItem
                    value="enterprise"
                    id="enterprise-plan"
                />
            </Label>
        </RadioGroup>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/radio-group#fieldset */
export const Fieldset: Story = {
    render: () => (
        <fieldset className="flex w-full max-w-xs flex-col gap-3 border-0 p-0">
            <legend className="text-sm font-medium">Subscription Plan</legend>
            <FieldDescription>
                Yearly and lifetime plans offer significant savings.
            </FieldDescription>
            <RadioGroup defaultValue="monthly">
                <RadioOption
                    value="monthly"
                    id="plan-monthly"
                    label="Monthly ($9.99/month)"
                />
                <RadioOption
                    value="yearly"
                    id="plan-yearly"
                    label="Yearly ($99.99/year)"
                />
                <RadioOption
                    value="lifetime"
                    id="plan-lifetime"
                    label="Lifetime ($299.99)"
                />
            </RadioGroup>
        </fieldset>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/radio-group#disabled */
export const Disabled: Story = {
    render: () => (
        <RadioGroup
            defaultValue="option2"
            className="w-fit"
        >
            <RadioOption
                value="option1"
                id="disabled-1"
                label="Disabled"
                disabled
            />
            <RadioOption
                value="option2"
                id="disabled-2"
                label="Option 2"
            />
            <RadioOption
                value="option3"
                id="disabled-3"
                label="Option 3"
            />
        </RadioGroup>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/radio-group#invalid */
export const Invalid: Story = {
    render: () => (
        <fieldset
            className="flex w-full max-w-xs flex-col gap-3 border-0 p-0"
            data-invalid
        >
            <legend className="text-sm font-medium">
                Notification Preferences
            </legend>
            <FieldDescription>
                Choose how you want to receive notifications.
            </FieldDescription>
            <RadioGroup defaultValue="email">
                <RadioOption
                    value="email"
                    id="invalid-email"
                    label="Email only"
                    invalid
                />
                <RadioOption
                    value="sms"
                    id="invalid-sms"
                    label="SMS only"
                    invalid
                />
                <RadioOption
                    value="both"
                    id="invalid-both"
                    label="Both Email & SMS"
                    invalid
                />
            </RadioGroup>
        </fieldset>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/radio-group#rtl */
export const Rtl: Story = {
    render: () => (
        <RadioGroup
            defaultValue="comfortable"
            className="w-fit"
            dir="rtl"
        >
            <RadioOption
                value="default"
                id="r1-rtl"
                label="افتراضي"
                description="تباعد قياسي لمعظم حالات الاستخدام."
            />
            <RadioOption
                value="comfortable"
                id="r2-rtl"
                label="مريح"
                description="مساحة أكبر بين العناصر."
            />
            <RadioOption
                value="compact"
                id="r3-rtl"
                label="مضغوط"
                description="تباعد أدنى للتخطيطات الكثيفة."
            />
        </RadioGroup>
    ),
};
