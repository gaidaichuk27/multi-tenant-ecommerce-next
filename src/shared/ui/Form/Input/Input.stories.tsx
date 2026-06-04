import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InfoIcon } from 'lucide-react';

import { Button } from '@shared/ui/Form/Button';
import { Label } from '@shared/ui/Form/Label';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@shared/ui/Form/InputGroup';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/Form/Select';
import { Input } from './Input';

type InputStoryArgs = {
    placeholder: string;
    disabled: boolean;
};

function FieldDescription({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p className={`text-muted-foreground text-sm ${className ?? ''}`}>
            {children}
        </p>
    );
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
    title: 'Shared/ui/Form/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
    },
    args: {
        placeholder: 'Enter text',
        disabled: false,
    },
} satisfies Meta<InputStoryArgs>;

export default meta;
type Story = StoryObj<InputStoryArgs>;

/** @see https://ui.shadcn.com/docs/components/radix/input */
export const Default: Story = {
    render: () => (
        <FieldBlock>
            <Label htmlFor="input-demo-api-key">API Key</Label>
            <Input
                id="input-demo-api-key"
                type="password"
                placeholder="sk-..."
            />
            <FieldDescription>
                Your API key is encrypted and stored securely.
            </FieldDescription>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#basic */
export const Basic: Story = {
    render: ({ placeholder, disabled }) => (
        <Input
            placeholder={placeholder}
            disabled={disabled}
            className="w-full max-w-sm"
        />
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#field */
export const Field: Story = {
    render: () => (
        <FieldBlock>
            <Label htmlFor="input-field-username">Username</Label>
            <Input
                id="input-field-username"
                type="text"
                placeholder="Enter your username"
            />
            <FieldDescription>
                Choose a unique username for your account.
            </FieldDescription>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#field-group */
export const FieldGroup: Story = {
    render: () => (
        <div className="flex w-full max-w-sm flex-col gap-4">
            <FieldBlock className="max-w-none">
                <Label htmlFor="fieldgroup-name">Name</Label>
                <Input
                    id="fieldgroup-name"
                    placeholder="Jordan Lee"
                />
            </FieldBlock>
            <FieldBlock className="max-w-none">
                <Label htmlFor="fieldgroup-email">Email</Label>
                <Input
                    id="fieldgroup-email"
                    type="email"
                    placeholder="name@example.com"
                />
                <FieldDescription>
                    We&apos;ll send updates to this address.
                </FieldDescription>
            </FieldBlock>
            <div className="flex gap-2">
                <Button
                    type="reset"
                    variant="outline"
                >
                    Reset
                </Button>
                <Button type="submit">Submit</Button>
            </div>
        </div>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#disabled */
export const Disabled: Story = {
    render: () => (
        <FieldBlock data-disabled>
            <Label htmlFor="input-demo-disabled">Email</Label>
            <Input
                id="input-demo-disabled"
                type="email"
                placeholder="Email"
                disabled
            />
            <FieldDescription>
                This field is currently disabled.
            </FieldDescription>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#invalid */
export const Invalid: Story = {
    render: () => (
        <FieldBlock data-invalid>
            <Label htmlFor="input-invalid">Invalid Input</Label>
            <Input
                id="input-invalid"
                placeholder="Error"
                aria-invalid
            />
            <FieldDescription>
                This field contains validation errors.
            </FieldDescription>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#file */
export const File: Story = {
    render: () => (
        <FieldBlock>
            <Label htmlFor="picture">Picture</Label>
            <Input
                id="picture"
                type="file"
            />
            <FieldDescription>Select a picture to upload.</FieldDescription>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#inline */
export const Inline: Story = {
    render: () => (
        <div className="flex w-full max-w-sm items-center gap-2">
            <Input
                type="search"
                placeholder="Search..."
                className="flex-1"
            />
            <Button>Search</Button>
        </div>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#grid */
export const Grid: Story = {
    render: () => (
        <div className="grid w-full max-w-sm grid-cols-2 gap-4">
            <FieldBlock className="max-w-none">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                    id="first-name"
                    placeholder="Jordan"
                />
            </FieldBlock>
            <FieldBlock className="max-w-none">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                    id="last-name"
                    placeholder="Lee"
                />
            </FieldBlock>
        </div>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#required */
export const Required: Story = {
    render: () => (
        <FieldBlock>
            <Label htmlFor="input-required">
                Required Field <span className="text-destructive">*</span>
            </Label>
            <Input
                id="input-required"
                placeholder="This field is required"
                required
            />
            <FieldDescription>This field must be filled out.</FieldDescription>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#badge */
export const Badge: Story = {
    render: () => (
        <FieldBlock>
            <Label
                htmlFor="input-badge"
                className="w-full justify-between"
            >
                Webhook URL
                <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs font-medium">
                    Beta
                </span>
            </Label>
            <Input
                id="input-badge"
                type="url"
                placeholder="https://api.example.com/webhook"
            />
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#input-group */
export const InputGroupExample: Story = {
    name: 'Input Group',
    render: () => (
        <FieldBlock>
            <Label htmlFor="input-group-url">Website URL</Label>
            <InputGroup>
                <InputGroupInput
                    id="input-group-url"
                    placeholder="example.com"
                />
                <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    <InfoIcon className="size-4" />
                </InputGroupAddon>
            </InputGroup>
        </FieldBlock>
    ),
};

/** Button group pattern (no ButtonGroup component — inline layout). */
export const ButtonGroupExample: Story = {
    name: 'Button Group',
    render: () => (
        <FieldBlock>
            <Label htmlFor="input-button-group">Search</Label>
            <div className="flex w-full gap-2">
                <Input
                    id="input-button-group"
                    placeholder="Type to search..."
                    className="flex-1"
                />
                <Button variant="outline">Search</Button>
            </div>
        </FieldBlock>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/input#form */
export const Form: Story = {
    render: () => (
        <form className="w-full max-w-sm">
            <div className="flex flex-col gap-4">
                <FieldBlock className="max-w-none">
                    <Label htmlFor="form-name">Name</Label>
                    <Input
                        id="form-name"
                        type="text"
                        placeholder="Evil Rabbit"
                        required
                    />
                </FieldBlock>
                <FieldBlock className="max-w-none">
                    <Label htmlFor="form-email">Email</Label>
                    <Input
                        id="form-email"
                        type="email"
                        placeholder="john@example.com"
                    />
                    <FieldDescription>
                        We&apos;ll never share your email with anyone.
                    </FieldDescription>
                </FieldBlock>
                <div className="grid grid-cols-2 gap-4">
                    <FieldBlock className="max-w-none">
                        <Label htmlFor="form-phone">Phone</Label>
                        <Input
                            id="form-phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                        />
                    </FieldBlock>
                    <FieldBlock className="max-w-none">
                        <Label htmlFor="form-country">Country</Label>
                        <Select defaultValue="us">
                            <SelectTrigger id="form-country">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">
                                    United States
                                </SelectItem>
                                <SelectItem value="uk">
                                    United Kingdom
                                </SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldBlock>
                </div>
                <FieldBlock className="max-w-none">
                    <Label htmlFor="form-address">Address</Label>
                    <Input
                        id="form-address"
                        type="text"
                        placeholder="123 Main St"
                    />
                </FieldBlock>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>
            </div>
        </form>
    ),
};
