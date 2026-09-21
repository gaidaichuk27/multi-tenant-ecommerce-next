import Link from 'next/link';
import type { PostReportDto } from '@repo/api';
import { ReportQueueActions } from '@features/group-feed';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { Avatar } from '@shared/ui/Avatar';

interface ReportsListViewProps {
    groupSlug: string;
    locale: Language;
    title: string;
    emptyLabel: string;
    hintLabel: string;
    resolveLabel: string;
    dismissLabel: string;
    reportedByLabel: string;
    reasonLabel: string;
    viewPostLabel: string;
    reports: PostReportDto[];
}

function snippet(body: string, max = 160) {
    const trimmed = body.trim();
    if (trimmed.length <= max) return trimmed;
    return `${trimmed.slice(0, max).trimEnd()}…`;
}

export function ReportsListView({
    groupSlug,
    locale,
    title,
    emptyLabel,
    hintLabel,
    resolveLabel,
    dismissLabel,
    reportedByLabel,
    reasonLabel,
    viewPostLabel,
    reports,
}: ReportsListViewProps) {
    return (
        <div>
            <h2 className="mb-1 text-lg font-semibold">{title}</h2>
            <p className="text-muted-foreground mb-4 text-sm">{hintLabel}</p>
            {reports.length === 0 ? (
                <p className="text-muted-foreground text-sm">{emptyLabel}</p>
            ) : (
                <ul className="divide-border divide-y rounded-md border">
                    {reports.map((report) => {
                        const postHref = report.post
                            ? buildLocalizedPathname(
                                  `/${groupSlug}/${report.post.id}`,
                                  locale,
                              )
                            : null;
                        const reporterName =
                            report.reporter?.name ??
                            report.reporter?.username ??
                            report.reporterId;
                        const postAuthorName =
                            report.post?.author?.name ??
                            report.post?.author?.username ??
                            report.post?.authorId;

                        return (
                            <li
                                key={report.id}
                                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
                            >
                                <Avatar
                                    user={{
                                        id:
                                            report.reporter?.id ??
                                            report.reporterId,
                                        name: report.reporter?.name ?? null,
                                        username:
                                            report.reporter?.username ??
                                            report.reporterId,
                                        email: '',
                                        avatarUrl:
                                            report.reporter?.avatarUrl ?? null,
                                    }}
                                />
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-muted-foreground text-sm">
                                        {reportedByLabel}:{' '}
                                        <span className="text-foreground font-medium">
                                            {reporterName}
                                        </span>
                                        {postAuthorName ? (
                                            <>
                                                {' · '}
                                                {postAuthorName}
                                            </>
                                        ) : null}
                                    </p>
                                    {report.post ? (
                                        <p className="text-sm whitespace-pre-wrap">
                                            {snippet(report.post.body)}
                                        </p>
                                    ) : null}
                                    {report.reason ? (
                                        <p className="text-muted-foreground text-sm">
                                            {reasonLabel}: {report.reason}
                                        </p>
                                    ) : null}
                                    {postHref ? (
                                        <Link
                                            href={postHref}
                                            className="text-primary text-sm font-medium underline-offset-2 hover:underline"
                                        >
                                            {viewPostLabel}
                                        </Link>
                                    ) : null}
                                    <p className="text-muted-foreground text-xs">
                                        {new Date(
                                            report.createdAt,
                                        ).toLocaleString(locale)}
                                    </p>
                                </div>
                                <ReportQueueActions
                                    groupSlug={groupSlug}
                                    reportId={report.id}
                                    resolveLabel={resolveLabel}
                                    dismissLabel={dismissLabel}
                                />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
