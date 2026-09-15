import type { Language } from '@shared/config/locales/types';

interface GroupFeedPlaceholderViewProps {
    locale: Language;
    title: string;
    description: string;
}

export function GroupFeedPlaceholderView({
    title,
    description,
}: GroupFeedPlaceholderViewProps) {
    return (
        <div className="rounded-md border border-dashed p-8 text-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-muted-foreground mt-2 text-sm">{description}</p>
        </div>
    );
}
