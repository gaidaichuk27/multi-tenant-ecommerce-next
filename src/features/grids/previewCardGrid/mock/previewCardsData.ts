import type { PreviewCardProps } from '@features/previewCard/previewCard';

import shopPreviewImg from './shop-preview-img.jpg';
import landPreviewImg from './shop-preview-logo.jpg';

export const previewCardsData: PreviewCardProps[] = [
    {
        _id: '1',
        href: '/groups/site-development',
        coverImage: shopPreviewImg,
        logo: landPreviewImg,
        title: 'Site Development',
        description:
            'Learn how to build fast, scalable storefronts with modern tools and best practices for multi-tenant e-commerce.',
        meta: {
            membersCount: '1.2k',
            priceLabel: 'Free',
        },
    },
    {
        _id: '2',
        href: '/groups/telegram-bots',
        coverImage: shopPreviewImg,
        logo: landPreviewImg,
        title: 'Telegram Bots',
        description:
            'Automate customer support, order updates, and marketing flows with production-ready Telegram bot patterns.',
        meta: {
            membersCount: '860',
            priceLabel: 'Free',
        },
    },
    {
        _id: '3',
        href: '/groups/ai-agents',
        coverImage: shopPreviewImg,
        logo: landPreviewImg,
        title: 'AI Agents',
        description:
            'Design and deploy AI agents that handle product discovery, recommendations, and post-purchase workflows.',
        meta: {
            membersCount: '2.4k',
            priceLabel: 'Paid',
        },
    },
    {
        _id: '4',
        href: 'https://skool.com/mastermind-success-club/about',
        coverImage: shopPreviewImg,
        logo: landPreviewImg,
        title: 'Meant For More LIVE',
        description:
            'Join Tony Robbins & Dean Graziosi — turn your life experience into real impact and success at Meant For More LIVE.',
        meta: {
            membersCount: '3.8k',
            priceLabel: 'Free',
        },
        external: true,
    },
];
