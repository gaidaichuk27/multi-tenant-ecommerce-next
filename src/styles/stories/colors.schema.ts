export type ColorToken = {
    name: string;
    cssVar: string;
    /** Sample text color (default `--foreground`) */
    sampleTextVar?: string;
    /** Tailwind class reference for docs */
    tailwindClass?: string;
    description?: string;
};

export type ColorGroup = {
    title: string;
    description?: string;
    tokens: ColorToken[];
};

/** Brand / accent themes from `themes.css` (applied via `theme-*` on `body`). */
export const brandThemes = [
    { label: 'Default', value: 'default' },
    { label: 'Neo Brutalism', value: 'neo-brutalism' },
    { label: 'Bubble Gum', value: 'bubble-gum' },
] as const;

export type BrandTheme = (typeof brandThemes)[number]['value'];

export const colorGroups: ColorGroup[] = [
    {
        title: 'Surface',
        description: 'Page and content surfaces.',
        tokens: [
            {
                name: 'Background',
                cssVar: '--background',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-background text-foreground',
            },
            {
                name: 'Foreground',
                cssVar: '--foreground',
                sampleTextVar: '--background',
                tailwindClass: 'text-foreground',
            },
            {
                name: 'Card',
                cssVar: '--card',
                sampleTextVar: '--card-foreground',
                tailwindClass: 'bg-card text-card-foreground',
            },
            {
                name: 'Popover',
                cssVar: '--popover',
                sampleTextVar: '--popover-foreground',
                tailwindClass: 'bg-popover text-popover-foreground',
            },
            {
                name: 'Muted',
                cssVar: '--muted',
                sampleTextVar: '--muted-foreground',
                tailwindClass: 'bg-muted text-muted-foreground',
            },
        ],
    },
    {
        title: 'Brand',
        description: 'Primary actions and emphasis.',
        tokens: [
            {
                name: 'Primary',
                cssVar: '--primary',
                sampleTextVar: '--primary-foreground',
                tailwindClass: 'bg-primary text-primary-foreground',
            },
            {
                name: 'Secondary',
                cssVar: '--secondary',
                sampleTextVar: '--secondary-foreground',
                tailwindClass: 'bg-secondary text-secondary-foreground',
            },
            {
                name: 'Accent',
                cssVar: '--accent',
                sampleTextVar: '--accent-foreground',
                tailwindClass: 'bg-accent text-accent-foreground',
            },
            {
                name: 'Destructive',
                cssVar: '--destructive',
                sampleTextVar: '--destructive-foreground',
                tailwindClass: 'bg-destructive text-destructive-foreground',
            },
        ],
    },
    {
        title: 'Layout sections',
        description: 'Container / section backgrounds (`Container` component).',
        tokens: [
            {
                name: 'Section primary',
                cssVar: '--section-primary-background',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-section-primary-background',
            },
            {
                name: 'Section secondary',
                cssVar: '--section-secondary-background',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-section-secondary-background',
            },
        ],
    },
    {
        title: 'UI',
        description: 'Borders, inputs, and focus rings.',
        tokens: [
            {
                name: 'Border',
                cssVar: '--border',
                sampleTextVar: '--foreground',
                tailwindClass: 'border-border',
            },
            {
                name: 'Input',
                cssVar: '--input',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-input',
            },
            {
                name: 'Ring',
                cssVar: '--ring',
                sampleTextVar: '--foreground',
                tailwindClass: 'ring-ring',
            },
        ],
    },
    {
        title: 'Charts',
        description: 'Data visualization palette.',
        tokens: [
            {
                name: 'Chart 1',
                cssVar: '--chart-1',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-chart-1',
            },
            {
                name: 'Chart 2',
                cssVar: '--chart-2',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-chart-2',
            },
            {
                name: 'Chart 3',
                cssVar: '--chart-3',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-chart-3',
            },
            {
                name: 'Chart 4',
                cssVar: '--chart-4',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-chart-4',
            },
            {
                name: 'Chart 5',
                cssVar: '--chart-5',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-chart-5',
            },
        ],
    },
    {
        title: 'Sidebar',
        description: 'Navigation sidebar tokens.',
        tokens: [
            {
                name: 'Sidebar',
                cssVar: '--sidebar',
                sampleTextVar: '--sidebar-foreground',
                tailwindClass: 'bg-sidebar text-sidebar-foreground',
            },
            {
                name: 'Sidebar primary',
                cssVar: '--sidebar-primary',
                sampleTextVar: '--sidebar-primary-foreground',
                tailwindClass:
                    'bg-sidebar-primary text-sidebar-primary-foreground',
            },
            {
                name: 'Sidebar accent',
                cssVar: '--sidebar-accent',
                sampleTextVar: '--sidebar-accent-foreground',
                tailwindClass:
                    'bg-sidebar-accent text-sidebar-accent-foreground',
            },
            {
                name: 'Sidebar border',
                cssVar: '--sidebar-border',
                sampleTextVar: '--sidebar-foreground',
                tailwindClass: 'bg-sidebar-border',
            },
            {
                name: 'Sidebar ring',
                cssVar: '--sidebar-ring',
                sampleTextVar: '--sidebar-foreground',
                tailwindClass: 'bg-sidebar-ring',
            },
        ],
    },
    {
        title: 'Notification    ',
        description: 'Notification color tokens.',
        tokens: [
            {
                name: 'Error',
                cssVar: '--error',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-error',
            },
            {
                name: 'Warning',
                cssVar: '--warning',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-warning',
            },
            {
                name: 'Success',
                cssVar: '--success',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-success',
            },
            {
                name: 'Info',
                cssVar: '--info',
                sampleTextVar: '--foreground',
                tailwindClass: 'bg-info',
            },
        ],
    },
];
