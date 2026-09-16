import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Container } from './Container';

type ContainerStoryArgs = {
    variant: 'primary' | 'secondary' | 'tertiary' | 'fullwidth';
    bgcolor: 'section-primary-background' | 'section-secondary-background';
    rounded: boolean;
    lightness: number;
};

const placeholder = (
    <div className="space-y-2 p-6">
        <h2 className="text-lg font-semibold">Container content</h2>
        <p className="text-muted-foreground text-sm">
            Layout wrapper with max-width, optional variant background, and CSS
            variables for background color and lightness.
        </p>
    </div>
);

function ContainerStory({
    variant,
    bgcolor,
    rounded,
    lightness,
}: ContainerStoryArgs) {
    return (
        <Container
            variant={variant}
            bgcolor={bgcolor}
            rounded={rounded}
            lightness={lightness}
        >
            {placeholder}
        </Container>
    );
}

const meta = {
    title: 'Shared/ui/Container',
    component: ContainerStory,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'fullwidth'],
            description:
                'Adds `.primary`, `.secondary`, `.tertiary`, or `.fullwidth` on `.container`.',
        },
        bgcolor: {
            control: 'select',
            options: [
                'section-primary-background',
                'section-secondary-background',
            ],
            description: 'Sets the `--bg-color` CSS variable.',
        },
        rounded: {
            control: 'boolean',
            description:
                'Applies `rounded-[25px]` when true (ignored for fullwidth).',
        },
        lightness: {
            control: { type: 'range', min: 0, max: 100, step: 5 },
            description: 'Sets the `--lightness` CSS variable (0–100).',
        },
    },
    args: {
        variant: 'primary',
        bgcolor: 'section-primary-background',
        rounded: true,
        lightness: 100,
    },
} satisfies Meta<ContainerStoryArgs>;

export default meta;
type Story = StoryObj<ContainerStoryArgs>;

export const Default: Story = {};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        bgcolor: 'section-secondary-background',
    },
};

export const Tertiary: Story = {
    args: {
        variant: 'tertiary',
    },
};

/** Full-width layout — separate export name avoids Storybook id clash with controls. */
export const EdgeToEdge: Story = {
    name: 'Full width',
    args: {
        variant: 'fullwidth',
        rounded: false,
    },
};

export const NotRounded: Story = {
    args: {
        rounded: false,
    },
};

export const CustomLightness: Story = {
    args: {
        variant: 'secondary',
        bgcolor: 'section-secondary-background',
        lightness: 60,
    },
};

export const Comparison: Story = {
    render: () => (
        <div className="flex flex-col gap-4 p-4">
            {(
                [
                    {
                        variant: 'primary' as const,
                        label: 'Primary',
                    },
                    {
                        variant: 'secondary' as const,
                        label: 'Secondary',
                    },
                    {
                        variant: 'tertiary' as const,
                        label: 'Tertiary',
                    },
                    {
                        variant: 'fullwidth' as const,
                        label: 'Full width',
                    },
                ] as const
            ).map(({ variant, label }) => (
                <Container
                    key={variant}
                    variant={variant}
                >
                    <div className="p-6">
                        <p className="text-sm font-medium">{label}</p>
                    </div>
                </Container>
            ))}
        </div>
    ),
};

export const WithContent: Story = {
    render: ({ variant, bgcolor, rounded, lightness }) => (
        <Container
            variant={variant}
            bgcolor={bgcolor}
            rounded={rounded}
            lightness={lightness}
            className="py-10"
        >
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((n) => (
                    <div
                        key={n}
                        className="bg-card text-card-foreground rounded-lg border p-4 shadow-xs"
                    >
                        Card {n}
                    </div>
                ))}
            </div>
        </Container>
    ),
};
