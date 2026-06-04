import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@shared/ui/Form/Button';
import { Input } from '@shared/ui/Form/Input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/Form/Select';
import { Textarea } from '@shared/ui/Form/Textarea';
import { Label } from './Label';

type LabelStoryArgs = {
    children: string;
};

function FieldDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-muted-foreground text-sm">{children}</p>;
}

function StoryCheckbox({
    id,
    defaultChecked,
    disabled,
    dir,
    className,
}: {
    id: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    dir?: 'ltr' | 'rtl';
    className?: string;
}) {
    return (
        <input
            type="checkbox"
            id={id}
            defaultChecked={defaultChecked}
            disabled={disabled}
            dir={dir}
            className={`border-input accent-primary size-4 shrink-0 rounded border disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}
        />
    );
}

const meta = {
    title: 'Shared/ui/Form/Label',
    component: Label,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
    args: {
        children: 'Your email address',
    },
} satisfies Meta<LabelStoryArgs>;

export default meta;
type Story = StoryObj<LabelStoryArgs>;

/** @see https://ui.shadcn.com/docs/components/radix/label */
export const Default: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <StoryCheckbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/label#usage */
export const Usage: Story = {
    render: ({ children }) => <Label htmlFor="email">{children}</Label>,
};

/** Label associated with an input control. */
export const WithInput: Story = {
    render: ({ children }) => (
        <div className="flex w-full max-w-sm flex-col gap-2">
            <Label htmlFor="email-input">{children}</Label>
            <Input
                id="email-input"
                type="email"
                placeholder="name@example.com"
            />
        </div>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/label#label-in-field */
export const LabelInField: Story = {
    name: 'Label in Field',
    render: () => (
        <form className="w-full max-w-md">
            <div className="flex flex-col gap-6">
                <fieldset className="flex flex-col gap-4 border-0 p-0">
                    <legend className="text-sm font-medium">
                        Payment Method
                    </legend>
                    <FieldDescription>
                        All transactions are secure and encrypted
                    </FieldDescription>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="checkout-card-name">
                                Name on Card
                            </Label>
                            <Input
                                id="checkout-card-name"
                                placeholder="Evil Rabbit"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="checkout-card-number">
                                Card Number
                            </Label>
                            <Input
                                id="checkout-card-number"
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                            <FieldDescription>
                                Enter your 16-digit card number
                            </FieldDescription>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="checkout-exp-month">
                                    Month
                                </Label>
                                <Select defaultValue="">
                                    <SelectTrigger id="checkout-exp-month">
                                        <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Array.from(
                                                { length: 12 },
                                                (_, i) => {
                                                    const month = String(
                                                        i + 1,
                                                    ).padStart(2, '0');
                                                    return (
                                                        <SelectItem
                                                            key={month}
                                                            value={month}
                                                        >
                                                            {month}
                                                        </SelectItem>
                                                    );
                                                },
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="checkout-exp-year">Year</Label>
                                <Select defaultValue="">
                                    <SelectTrigger id="checkout-exp-year">
                                        <SelectValue placeholder="YYYY" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {[
                                                '2024',
                                                '2025',
                                                '2026',
                                                '2027',
                                                '2028',
                                                '2029',
                                            ].map((year) => (
                                                <SelectItem
                                                    key={year}
                                                    value={year}
                                                >
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="checkout-cvv">CVV</Label>
                                <Input
                                    id="checkout-cvv"
                                    placeholder="123"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>

                <hr className="border-border" />

                <fieldset className="flex flex-col gap-4 border-0 p-0">
                    <legend className="text-sm font-medium">
                        Billing Address
                    </legend>
                    <FieldDescription>
                        The billing address associated with your payment method
                    </FieldDescription>
                    <div className="flex items-center gap-2">
                        <StoryCheckbox
                            id="checkout-same-as-shipping"
                            defaultChecked
                        />
                        <Label
                            htmlFor="checkout-same-as-shipping"
                            className="font-normal"
                        >
                            Same as shipping address
                        </Label>
                    </div>
                </fieldset>

                <fieldset className="flex flex-col gap-4 border-0 p-0">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="checkout-comments">Comments</Label>
                        <Textarea
                            id="checkout-comments"
                            placeholder="Add any additional comments"
                            className="resize-none"
                        />
                    </div>
                </fieldset>

                <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
                    <Button
                        type="button"
                        variant="outline"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    ),
    parameters: {
        layout: 'padded',
    },
};

/** Disabled control — label uses peer-disabled styles when the control is disabled. */
export const Disabled: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <StoryCheckbox
                id="disabled-terms"
                disabled
                className="peer"
            />
            <Label htmlFor="disabled-terms">Accept terms and conditions</Label>
        </div>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/label#rtl */
export const Rtl: Story = {
    render: () => (
        <div
            className="flex items-center gap-2"
            dir="rtl"
        >
            <StoryCheckbox
                id="terms-rtl"
                dir="rtl"
            />
            <Label
                htmlFor="terms-rtl"
                dir="rtl"
            >
                قبول الشروط والأحكام
            </Label>
        </div>
    ),
};
