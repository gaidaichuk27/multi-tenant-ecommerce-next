import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LangSelector } from '@features/langSelector';

type LangSelectorStoryArgs = {
    slim: boolean;
    disabled: boolean;
    placeholder?: string;
};

const meta = {
    title: 'Features/LangSelector',
    component: LangSelector,
    parameters: {
        layout: 'centered',
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/en',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        slim: {
            control: 'boolean',
            description: 'Compact trigger: flag + chevron only (header style).',
        },
        disabled: {
            control: 'boolean',
        },
        placeholder: {
            control: 'text',
        },
    },
    args: {
        slim: false,
        disabled: false,
        placeholder: 'Select language',
    },
} satisfies Meta<LangSelectorStoryArgs>;

export default meta;
type Story = StoryObj<LangSelectorStoryArgs>;

export const Default: Story = {
    render: (args) => <LangSelector {...args} />,
};

/** Header-style compact trigger (flag only). */
export const Slim: Story = {
    args: {
        slim: true,
    },
    render: (args) => <LangSelector {...args} />,
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    render: (args) => <LangSelector {...args} />,
};

export const Ukrainian: Story = {
    render: (args) => <LangSelector {...args} />,
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/ua',
            },
        },
    },
};

export const Polish: Story = {
    render: (args) => <LangSelector {...args} />,
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/pl',
            },
        },
    },
};

export const German: Story = {
    render: (args) => <LangSelector {...args} />,
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/de',
            },
        },
    },
};

/** Matches header: slim selector beside theme controls. */
export const InToolbar: Story = {
    args: {
        slim: true,
    },
    parameters: {
        layout: 'fullscreen',
    },
    render: (args) => (
        <div className="border-border bg-background flex h-14 items-center justify-end gap-2 border-b px-4">
            <LangSelector {...args} />
        </div>
    ),
};
