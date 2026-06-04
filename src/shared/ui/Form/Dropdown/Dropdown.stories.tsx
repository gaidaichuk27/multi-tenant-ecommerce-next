import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
    BadgeCheckIcon,
    BellIcon,
    Building2Icon,
    CreditCardIcon,
    DownloadIcon,
    EyeIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    FolderOpenIcon,
    FolderSearchIcon,
    HelpCircleIcon,
    KeyboardIcon,
    LanguagesIcon,
    LayoutIcon,
    LogOutIcon,
    MailIcon,
    MessageSquareIcon,
    MonitorIcon,
    MoonIcon,
    MoreHorizontalIcon,
    PaletteIcon,
    PencilIcon,
    SaveIcon,
    SettingsIcon,
    ShareIcon,
    ShieldIcon,
    SunIcon,
    TrashIcon,
    UserIcon,
    WalletIcon,
} from 'lucide-react';

import { ThemeToggle } from '@features/theme';
import { Button } from '@shared/ui/Form/Button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    type DropdownMenuSize,
} from './Dropdown';

type DropdownStoryArgs = {
    size: DropdownMenuSize;
};

const meta = {
    title: 'Shared/ui/Form/Dropdown',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg'],
        },
    },
    args: {
        size: 'default',
    },
} satisfies Meta<DropdownStoryArgs>;

export default meta;
type Story = StoryObj<DropdownStoryArgs>;

function OpenButton({
    children = 'Open',
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <Button
            variant="outline"
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}

function StoryAvatar({ src, alt }: { src: string; alt: string }) {
    return (
        <span className="bg-muted relative flex size-8 shrink-0 overflow-hidden rounded-full">
            {/* Storybook demo avatars from external URLs */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className="aspect-square size-full object-cover"
            />
        </span>
    );
}

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#basic */
export const Basic: Story = {
    render: ({ size }) => (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#submenu */
export const Submenu: Story = {
    render: ({ size }) => (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Invite users
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Email</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        More options
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>
                                                Calendly
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Slack
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                Webhook
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Advanced...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#shortcuts */
export const Shortcuts: Story = {
    render: ({ size }) => (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Billing
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#icons */
export const Icons: Story = {
    render: ({ size }) => (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <UserIcon />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CreditCardIcon />
                    Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <SettingsIcon />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                    <LogOutIcon />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

function CheckboxesDemo({ size }: DropdownStoryArgs) {
    const [showStatusBar, setShowStatusBar] = React.useState(true);
    const [showActivityBar, setShowActivityBar] = React.useState(false);
    const [showPanel, setShowPanel] = React.useState(false);

    return (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={showStatusBar}
                        onCheckedChange={setShowStatusBar}
                    >
                        Status Bar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showActivityBar}
                        onCheckedChange={setShowActivityBar}
                        disabled
                    >
                        Activity Bar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showPanel}
                        onCheckedChange={setShowPanel}
                    >
                        Panel
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#checkboxes */
export const Checkboxes: Story = {
    render: (args) => <CheckboxesDemo {...args} />,
};

function CheckboxesIconsDemo({ size }: DropdownStoryArgs) {
    const [notifications, setNotifications] = React.useState({
        email: true,
        sms: false,
        push: true,
    });

    return (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton>Notifications</OpenButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        Notification Preferences
                    </DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                            setNotifications({
                                ...notifications,
                                email: checked === true,
                            })
                        }
                    >
                        <MailIcon />
                        Email notifications
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={notifications.sms}
                        onCheckedChange={(checked) =>
                            setNotifications({
                                ...notifications,
                                sms: checked === true,
                            })
                        }
                    >
                        <MessageSquareIcon />
                        SMS notifications
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                            setNotifications({
                                ...notifications,
                                push: checked === true,
                            })
                        }
                    >
                        <BellIcon />
                        Push notifications
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#checkboxes-icons */
export const CheckboxesIcons: Story = {
    render: (args) => <CheckboxesIconsDemo {...args} />,
};

function RadioGroupDemo({ size }: DropdownStoryArgs) {
    const [position, setPosition] = React.useState('bottom');

    return (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={position}
                        onValueChange={setPosition}
                    >
                        <DropdownMenuRadioItem value="top">
                            Top
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="bottom">
                            Bottom
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="right">
                            Right
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#radio-group */
export const MenuRadioGroup: Story = {
    name: 'Radio group',
    render: (args) => <RadioGroupDemo {...args} />,
};

function RadioIconsDemo({ size }: DropdownStoryArgs) {
    const [paymentMethod, setPaymentMethod] = React.useState('card');

    return (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton>Payment Method</OpenButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                    >
                        <DropdownMenuRadioItem value="card">
                            <CreditCardIcon />
                            Credit Card
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="paypal">
                            <WalletIcon />
                            PayPal
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="bank">
                            <Building2Icon />
                            Bank Transfer
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#radio-icons */
export const RadioIcons: Story = {
    render: (args) => <RadioIconsDemo {...args} />,
};

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#destructive */
export const Destructive: Story = {
    render: ({ size }) => (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton>Actions</OpenButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <PencilIcon />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <ShareIcon />
                        Share
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                        <TrashIcon />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#avatar */
export const Avatar: Story = {
    render: ({ size }) => (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                >
                    <StoryAvatar
                        src="https://github.com/shadcn.png"
                        alt="shadcn"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BadgeCheckIcon />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCardIcon />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BellIcon />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOutIcon />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

function ComplexDemo({ size }: DropdownStoryArgs) {
    const [notifications, setNotifications] = React.useState({
        email: true,
        sms: false,
        push: true,
    });
    const [theme, setTheme] = React.useState('light');

    return (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <OpenButton>Complex Menu</OpenButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>File</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <FileIcon />
                        New File
                        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <FolderIcon />
                        New Folder
                        <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <FolderOpenIcon />
                            Open Recent
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Recent Projects
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <FileCodeIcon />
                                        Project Alpha
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <FileCodeIcon />
                                        Project Beta
                                    </DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <MoreHorizontalIcon />
                                            More Projects
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>
                                                    <FileCodeIcon />
                                                    Project Gamma
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FileCodeIcon />
                                                    Project Delta
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <FolderSearchIcon />
                                        Browse...
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <SaveIcon />
                        Save
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <DownloadIcon />
                        Export
                        <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>View</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                            setNotifications({
                                ...notifications,
                                email: checked === true,
                            })
                        }
                    >
                        <EyeIcon />
                        Show Sidebar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={notifications.sms}
                        onCheckedChange={(checked) =>
                            setNotifications({
                                ...notifications,
                                sms: checked === true,
                            })
                        }
                    >
                        <LayoutIcon />
                        Show Status Bar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <PaletteIcon />
                            Theme
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Appearance
                                    </DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                        value={theme}
                                        onValueChange={setTheme}
                                    >
                                        <DropdownMenuRadioItem value="light">
                                            <SunIcon />
                                            Light
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="dark">
                                            <MoonIcon />
                                            Dark
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="system">
                                            <MonitorIcon />
                                            System
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <UserIcon />
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCardIcon />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <SettingsIcon />
                            Settings
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                        Preferences
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <KeyboardIcon />
                                        Keyboard Shortcuts
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <LanguagesIcon />
                                        Language
                                    </DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <BellIcon />
                                            Notifications
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuGroup>
                                                    <DropdownMenuLabel>
                                                        Notification Types
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuCheckboxItem
                                                        checked={
                                                            notifications.push
                                                        }
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setNotifications({
                                                                ...notifications,
                                                                push:
                                                                    checked ===
                                                                    true,
                                                            })
                                                        }
                                                    >
                                                        <BellIcon />
                                                        Push Notifications
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        checked={
                                                            notifications.email
                                                        }
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setNotifications({
                                                                ...notifications,
                                                                email:
                                                                    checked ===
                                                                    true,
                                                            })
                                                        }
                                                    >
                                                        <MailIcon />
                                                        Email Notifications
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <ShieldIcon />
                                        Privacy & Security
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <HelpCircleIcon />
                        Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <FileTextIcon />
                        Documentation
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                        <LogOutIcon />
                        Sign Out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** @see https://ui.shadcn.com/docs/components/radix/dropdown-menu#complex */
export const Complex: Story = {
    render: (args) => <ComplexDemo {...args} />,
};

/** Compact menu density (`size="sm"`). */
export const Sm: Story = {
    args: { size: 'sm' },
    render: ({ size }) => (
        <DropdownMenu size={size}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                >
                    Open
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                    <LogOutIcon />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

/** App usage: header theme toggle. */
export const ThemeToggleExample: Story = {
    render: () => <ThemeToggle />,
};
