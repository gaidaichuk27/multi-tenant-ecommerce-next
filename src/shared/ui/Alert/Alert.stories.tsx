import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    CheckCircle2,
    CircleAlert,
    InfoIcon,
    TriangleAlert,
    XCircle,
} from 'lucide-react';

import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
    type AlertVariant,
} from './Alert';
import { Button } from '@shared/ui/Form/Button';

const meta = {
    title: 'Shared/ui/Alert',
    component: Alert,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'info',
                'success',
                'warning',
                'destructive',
                'error',
            ] satisfies AlertVariant[],
        },
    },
    args: {
        variant: 'default',
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    render: (args) => (
        <Alert
            {...args}
            className="w-[min(100vw-2rem,24rem)]"
        >
            <InfoIcon />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
                You can use alerts for short status messages.
            </AlertDescription>
        </Alert>
    ),
};

export const Info: Story = {
    args: { variant: 'info' },
    render: (args) => (
        <Alert
            {...args}
            className="w-[min(100vw-2rem,24rem)]"
        >
            <InfoIcon />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
                Categories help members filter the feed.
            </AlertDescription>
        </Alert>
    ),
};

export const Success: Story = {
    args: { variant: 'success' },
    render: (args) => (
        <Alert
            {...args}
            className="w-[min(100vw-2rem,24rem)]"
        >
            <CheckCircle2 />
            <AlertTitle>Category created</AlertTitle>
            <AlertDescription>
                Your new category is ready to use.
            </AlertDescription>
        </Alert>
    ),
};

export const Warning: Story = {
    args: { variant: 'warning' },
    render: (args) => (
        <Alert
            {...args}
            className="w-[min(100vw-2rem,24rem)]"
        >
            <TriangleAlert />
            <AlertTitle>Maximum of 10 categories reached</AlertTitle>
            <AlertDescription>
                Delete a category before adding another.
            </AlertDescription>
        </Alert>
    ),
};

export const Destructive: Story = {
    args: { variant: 'destructive' },
    render: (args) => (
        <Alert
            {...args}
            className="w-[min(100vw-2rem,24rem)]"
        >
            <CircleAlert />
            <AlertTitle>Unable to save</AlertTitle>
            <AlertDescription>
                Something went wrong. Please try again.
            </AlertDescription>
        </Alert>
    ),
};

export const Error: Story = {
    args: { variant: 'error' },
    render: (args) => (
        <Alert
            {...args}
            className="w-[min(100vw-2rem,24rem)]"
        >
            <XCircle />
            <AlertTitle>A category with this name already exists</AlertTitle>
            <AlertDescription>
                Choose a different name and try again.
            </AlertDescription>
        </Alert>
    ),
};

export const WithAction: Story = {
    args: { variant: 'warning' },
    render: (args) => (
        <Alert
            {...args}
            className="w-[min(100vw-2rem,24rem)]"
        >
            <TriangleAlert />
            <AlertTitle>Maximum of 10 categories reached</AlertTitle>
            <AlertDescription>
                Delete a category before adding another.
            </AlertDescription>
            <AlertAction>
                <Button
                    type="button"
                    variant="outline"
                    size="xs"
                >
                    Manage
                </Button>
            </AlertAction>
        </Alert>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-[min(100vw-2rem,24rem)] flex-col gap-3">
            <Alert variant="default">
                <InfoIcon />
                <AlertTitle>Default</AlertTitle>
                <AlertDescription>Neutral status message.</AlertDescription>
            </Alert>
            <Alert variant="info">
                <InfoIcon />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>Helpful context or tip.</AlertDescription>
            </Alert>
            <Alert variant="success">
                <CheckCircle2 />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Action completed.</AlertDescription>
            </Alert>
            <Alert variant="warning">
                <TriangleAlert />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>Limit or caution state.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>Destructive</AlertTitle>
                <AlertDescription>Shadcn destructive token.</AlertDescription>
            </Alert>
            <Alert variant="error">
                <XCircle />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Notification error token.</AlertDescription>
            </Alert>
        </div>
    ),
};
