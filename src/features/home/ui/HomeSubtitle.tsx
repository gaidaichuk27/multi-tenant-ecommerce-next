'use client';

import { TypographyTrans } from '@shared/ui/Typography';

export function HomeSubtitle() {
    return (
        <TypographyTrans
            i18nKey="home.subtitle"
            variant="title-5"
            weight={400}
            color="var(--muted-foreground)"
            align="center"
            href="/create"
        />
    );
}
