import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@shared/ui/Form/Button';
import { Label } from '@shared/ui/Form/Label';
import { Textarea } from './Textarea';

type TextareaStoryArgs = {
    placeholder: string;
    disabled: boolean;
};

function FieldDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-muted-foreground text-sm">{children}</p>;
}

function FieldBlock({
    children,
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            className={`flex w-full max-w-sm flex-col gap-2 ${className ?? ''}`}
            {...props}
        >
            {children}
        </div>
    );
}

const meta = {
    title: 'Shared/ui/Form/Textarea',
    component: Textarea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    args: {
        placeholder: 'Type your message here.',
        disabled: false,
    },
} satisfies Meta<TextareaStoryArgs>;

export default meta;
type Story = StoryObj<TextareaStoryArgs>;

/** @see https://ui.shadcn.com/docs/components/radix/textarea */
export const Default: Story = {
    render: ({ placeholder, disabled }) => (
        <Textarea
            placeholder={placeholder}
            disabled={disabled}
            className="w-full max-w-sm"
        />
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/textarea#field */
export const Field: Story = {
    render: () => (
        <FieldBlock>
            <Label htmlFor="message">Message</Label>
            <Textarea
                id="message"
                placeholder="Type your message here."
            />
            <FieldDescription>Enter your message below.</FieldDescription>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/textarea#disabled */
export const Disabled: Story = {
    render: () => (
        <FieldBlock data-disabled>
            <Label htmlFor="message-disabled">Message</Label>
            <Textarea
                id="message-disabled"
                placeholder="Type your message here."
                disabled
            />
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/textarea#invalid */
export const Invalid: Story = {
    render: () => (
        <FieldBlock data-invalid>
            <Label htmlFor="message-invalid">Message</Label>
            <Textarea
                id="message-invalid"
                placeholder="Type your message here."
                aria-invalid
            />
            <FieldDescription>Please enter a valid message.</FieldDescription>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/textarea#button */
export const WithButton: Story = {
    name: 'Button',
    render: () => (
        <div className="flex w-full max-w-sm flex-col gap-2">
            <Textarea placeholder="Type your message here." />
            <Button>Send message</Button>
        </div>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/textarea#rtl */
export const Rtl: Story = {
    render: () => (
        <FieldBlock dir="rtl">
            <Label
                htmlFor="message-rtl"
                dir="rtl"
            >
                التعليقات
            </Label>
            <Textarea
                id="message-rtl"
                dir="rtl"
                placeholder="شاركنا أفكارك حول خدمتنا."
                className="resize-none"
            />
            <FieldDescription>شاركنا أفكارك حول خدمتنا.</FieldDescription>
        </FieldBlock>
    ),
};
