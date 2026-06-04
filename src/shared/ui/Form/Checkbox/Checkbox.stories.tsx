'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Label } from '@shared/ui/Form/Label';
import { Checkbox } from './Checkbox';

type CheckboxStoryArgs = {
    defaultChecked: boolean;
    disabled: boolean;
};

function FieldDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-muted-foreground text-sm">{children}</p>;
}

function FieldRow({
    children,
    className,
    disabled,
    invalid,
}: {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    invalid?: boolean;
}) {
    return (
        <div
            className={`flex items-start gap-3 ${className ?? ''}`}
            data-disabled={disabled || undefined}
            data-invalid={invalid || undefined}
        >
            {children}
        </div>
    );
}

const meta = {
    title: 'Shared/ui/Form/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        defaultChecked: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    args: {
        defaultChecked: false,
        disabled: false,
    },
} satisfies Meta<CheckboxStoryArgs>;

export default meta;
type Story = StoryObj<CheckboxStoryArgs>;

/** @see https://ui.shadcn.com/docs/components/radix/checkbox */
export const Default: Story = {
    render: () => (
        <div className="flex max-w-sm flex-col gap-4">
            <FieldRow className="items-center">
                <Checkbox
                    id="terms-checkbox"
                    name="terms-checkbox"
                />
                <Label htmlFor="terms-checkbox">
                    Accept terms and conditions
                </Label>
            </FieldRow>
            <FieldRow>
                <Checkbox
                    id="terms-checkbox-2"
                    name="terms-checkbox-2"
                    defaultChecked
                />
                <div className="grid gap-1">
                    <Label htmlFor="terms-checkbox-2">
                        Accept terms and conditions
                    </Label>
                    <FieldDescription>
                        By clicking this checkbox, you agree to the terms.
                    </FieldDescription>
                </div>
            </FieldRow>
            <FieldRow
                disabled
                className="items-center"
            >
                <Checkbox
                    id="toggle-checkbox"
                    name="toggle-checkbox"
                    disabled
                />
                <Label htmlFor="toggle-checkbox">Enable notifications</Label>
            </FieldRow>
            <Label
                htmlFor="toggle-checkbox-2"
                className="font-normal"
            >
                <FieldRow className="items-start">
                    <Checkbox
                        id="toggle-checkbox-2"
                        name="toggle-checkbox-2"
                    />
                    <div className="grid gap-1">
                        <span className="text-sm font-medium">
                            Enable notifications
                        </span>
                        <FieldDescription>
                            You can enable or disable notifications at any time.
                        </FieldDescription>
                    </div>
                </FieldRow>
            </Label>
        </div>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/checkbox#basic */
export const Basic: Story = {
    render: () => (
        <FieldRow className="mx-auto w-56 items-center">
            <Checkbox id="terms-checkbox-basic" />
            <Label htmlFor="terms-checkbox-basic">
                Accept terms and conditions
            </Label>
        </FieldRow>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/checkbox#description */
export const Description: Story = {
    render: () => (
        <FieldRow className="mx-auto w-72">
            <Checkbox
                id="terms-checkbox-desc"
                defaultChecked
            />
            <div className="grid gap-1">
                <Label htmlFor="terms-checkbox-desc">
                    Accept terms and conditions
                </Label>
                <FieldDescription>
                    By clicking this checkbox, you agree to the terms and
                    conditions.
                </FieldDescription>
            </div>
        </FieldRow>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/checkbox#checked-state */
export const Controlled: Story = {
    render: function ControlledCheckbox() {
        const [checked, setChecked] = React.useState(false);

        return (
            <div className="flex flex-col items-center gap-3">
                <FieldRow className="items-center">
                    <Checkbox
                        id="controlled-checkbox"
                        checked={checked}
                        onCheckedChange={(value) => setChecked(value === true)}
                    />
                    <Label htmlFor="controlled-checkbox">
                        Controlled checkbox
                    </Label>
                </FieldRow>
                <p className="text-muted-foreground text-xs">
                    Checked: {checked ? 'yes' : 'no'}
                </p>
            </div>
        );
    },
};

/** @see https://ui.shadcn.com/docs/components/radix/checkbox#disabled */
export const Disabled: Story = {
    render: () => (
        <FieldRow
            className="mx-auto w-56 items-center"
            disabled
        >
            <Checkbox
                id="toggle-checkbox-disabled"
                disabled
            />
            <Label htmlFor="toggle-checkbox-disabled">
                Enable notifications
            </Label>
        </FieldRow>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/checkbox#invalid-state */
export const Invalid: Story = {
    render: () => (
        <FieldRow
            className="mx-auto w-56 items-center"
            invalid
        >
            <Checkbox
                id="terms-checkbox-invalid"
                aria-invalid
            />
            <Label htmlFor="terms-checkbox-invalid">
                Accept terms and conditions
            </Label>
        </FieldRow>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/checkbox#group */
export const CheckboxGroup: Story = {
    name: 'Group',
    render: () => (
        <fieldset className="flex max-w-sm flex-col gap-3 border-0 p-0">
            <legend className="text-sm font-medium">
                Show these items on the desktop:
            </legend>
            <FieldDescription>
                Select the items you want to show on the desktop.
            </FieldDescription>
            <div className="flex flex-col gap-3">
                <FieldRow className="items-center">
                    <Checkbox
                        id="hard-disks"
                        defaultChecked
                    />
                    <Label
                        htmlFor="hard-disks"
                        className="font-normal"
                    >
                        Hard disks
                    </Label>
                </FieldRow>
                <FieldRow className="items-center">
                    <Checkbox
                        id="external-disks"
                        defaultChecked
                    />
                    <Label
                        htmlFor="external-disks"
                        className="font-normal"
                    >
                        External disks
                    </Label>
                </FieldRow>
                <FieldRow className="items-center">
                    <Checkbox id="cds-dvds" />
                    <Label
                        htmlFor="cds-dvds"
                        className="font-normal"
                    >
                        CDs, DVDs, and iPods
                    </Label>
                </FieldRow>
                <FieldRow className="items-center">
                    <Checkbox id="connected-servers" />
                    <Label
                        htmlFor="connected-servers"
                        className="font-normal"
                    >
                        Connected servers
                    </Label>
                </FieldRow>
            </div>
        </fieldset>
    ),
};

const tableData = [
    {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        role: 'Admin',
    },
    {
        id: '2',
        name: 'Marcus Rodriguez',
        email: 'marcus.rodriguez@example.com',
        role: 'User',
    },
    {
        id: '3',
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        role: 'User',
    },
    {
        id: '4',
        name: 'David Kim',
        email: 'david.kim@example.com',
        role: 'Editor',
    },
] as const;

/** @see https://ui.shadcn.com/docs/components/radix/checkbox#table */
export const Table: Story = {
    render: function CheckboxTable() {
        const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
            new Set(['1']),
        );

        const selectAll = selectedRows.size === tableData.length;

        const handleSelectAll = (checked: boolean) => {
            if (checked) {
                setSelectedRows(new Set(tableData.map((row) => row.id)));
            } else {
                setSelectedRows(new Set());
            }
        };

        const handleSelectRow = (id: string, checked: boolean) => {
            const next = new Set(selectedRows);
            if (checked) {
                next.add(id);
            } else {
                next.delete(id);
            }
            setSelectedRows(next);
        };

        return (
            <div className="w-full max-w-2xl overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="w-10 p-3 text-left">
                                <Checkbox
                                    id="select-all"
                                    checked={selectAll}
                                    onCheckedChange={(checked) =>
                                        handleSelectAll(checked === true)
                                    }
                                    aria-label="Select all"
                                />
                            </th>
                            <th className="p-3 text-left font-medium">Name</th>
                            <th className="p-3 text-left font-medium">Email</th>
                            <th className="p-3 text-left font-medium">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row) => {
                            const selected = selectedRows.has(row.id);
                            return (
                                <tr
                                    key={row.id}
                                    className={
                                        selected ? 'bg-muted/50' : undefined
                                    }
                                    data-state={
                                        selected ? 'selected' : undefined
                                    }
                                >
                                    <td className="p-3">
                                        <Checkbox
                                            id={`row-${row.id}`}
                                            checked={selected}
                                            onCheckedChange={(checked) =>
                                                handleSelectRow(
                                                    row.id,
                                                    checked === true,
                                                )
                                            }
                                            aria-label={`Select ${row.name}`}
                                        />
                                    </td>
                                    <td className="p-3 font-medium">
                                        {row.name}
                                    </td>
                                    <td className="text-muted-foreground p-3">
                                        {row.email}
                                    </td>
                                    <td className="p-3">{row.role}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/** @see https://ui.shadcn.com/docs/components/radix/checkbox#rtl */
export const Rtl: Story = {
    render: () => (
        <div
            className="flex max-w-sm flex-col gap-4"
            dir="rtl"
        >
            <FieldRow className="items-center">
                <Checkbox id="terms-checkbox-rtl" />
                <Label htmlFor="terms-checkbox-rtl">قبول الشروط والأحكام</Label>
            </FieldRow>
            <FieldRow>
                <Checkbox
                    id="terms-checkbox-2-rtl"
                    defaultChecked
                />
                <div className="grid gap-1">
                    <Label htmlFor="terms-checkbox-2-rtl">
                        قبول الشروط والأحكام
                    </Label>
                    <FieldDescription>
                        بالنقر على هذا المربع، فإنك توافق على الشروط.
                    </FieldDescription>
                </div>
            </FieldRow>
            <FieldRow
                disabled
                className="items-center"
            >
                <Checkbox
                    id="toggle-checkbox-rtl"
                    disabled
                />
                <Label htmlFor="toggle-checkbox-rtl">تفعيل الإشعارات</Label>
            </FieldRow>
        </div>
    ),
};

/** Playground for defaultChecked / disabled controls. */
export const Playground: Story = {
    render: ({ defaultChecked, disabled }) => (
        <FieldRow className="items-center">
            <Checkbox
                id="playground-checkbox"
                defaultChecked={defaultChecked}
                disabled={disabled}
            />
            <Label htmlFor="playground-checkbox">Toggle me</Label>
        </FieldRow>
    ),
};
