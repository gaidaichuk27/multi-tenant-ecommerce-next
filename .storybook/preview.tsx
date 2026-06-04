import type { Preview } from '@storybook/nextjs-vite';
import '../src/styles/globals.css';
import { StorybookThemeDecorator } from './StorybookThemeDecorator';

const preview: Preview = {
    decorators: [
        (Story) => (
            <StorybookThemeDecorator>
                <Story />
            </StorybookThemeDecorator>
        ),
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            autodocs: 'tag',
        },
    },
};

export default preview;
