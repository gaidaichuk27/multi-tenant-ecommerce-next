import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
    title: 'Shared/ui/Button',
    component: Button,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'outline',
                'ghost',
                'destructive',
                'link',
            ],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: 'default',
        size: 'default',
        disabled: false,
        children: 'Click me!',
        className: '',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        size: 'default',
        disabled: false,
        children: 'Click me!',
        className: '',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        size: 'default',
        disabled: false,
        children: 'Click me!',
        className: '',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        size: 'default',
        disabled: false,
        children: 'Click me!',
        className: '',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        size: 'default',
        disabled: false,
        children: 'Click me!',
        className: '',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        size: 'default',
        disabled: false,
        children: 'Click me!',
        className: '',
    },
};
