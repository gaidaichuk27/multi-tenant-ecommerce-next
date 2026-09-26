import { z } from 'zod';
import {
    groupSlugInputSchema,
    membershipUserSummarySchema,
    serializeMembershipUserSummary,
} from './membership';

/** Single source of truth for post types (Prisma + API). */
export const POST_TYPES = ['text'] as const;

export const postTypeSchema = z.enum(POST_TYPES);

export const postBodySchema = z.string().trim().min(1).max(20_000);

export const postSchema = z.object({
    id: z.string(),
    groupId: z.string(),
    authorId: z.string(),
    categoryId: z.string().nullable(),
    body: z.string(),
    type: postTypeSchema,
    pinned: z.boolean(),
    broadcastEmail: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    author: membershipUserSummarySchema.optional(),
    commentCount: z.number().int().nonnegative().optional(),
    likeCount: z.number().int().nonnegative().optional(),
    likedByViewer: z.boolean().optional(),
});

export const postListInputSchema = groupSlugInputSchema.extend({
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(50).default(20),
    /** When set, only posts in this category (must belong to the group). */
    categoryId: z.string().min(1).optional(),
});

export const postListPageSchema = z.object({
    items: z.array(postSchema),
    nextCursor: z.string().nullable(),
});

export const postCreateInputSchema = groupSlugInputSchema.extend({
    body: postBodySchema,
    /** Optional; omit or null for uncategorized. */
    categoryId: z.string().min(1).nullable().optional(),
});

export const postGetInputSchema = groupSlugInputSchema.extend({
    postId: z.string().min(1),
});

export const postUpdateInputSchema = postGetInputSchema.extend({
    body: postBodySchema,
    /** Omit to leave unchanged; null clears; id must belong to the group. */
    categoryId: z.string().min(1).nullable().optional(),
});

/** Result of `post.like` toggle. */
export const postLikeResultSchema = z.object({
    liked: z.boolean(),
    likeCount: z.number().int().nonnegative(),
});

/** Result of `post.pin` toggle. */
export const postPinResultSchema = z.object({
    pinned: z.boolean(),
});

/** Single source of truth for report statuses (Prisma + API). */
export const POST_REPORT_STATUSES = ['open', 'resolved', 'dismissed'] as const;

export const postReportStatusSchema = z.enum(POST_REPORT_STATUSES);

/** Optional free-text reason when reporting a post. */
export const POST_REPORT_REASON_MAX_LENGTH = 500;

export const postReportReasonSchema = z
    .string()
    .trim()
    .max(POST_REPORT_REASON_MAX_LENGTH)
    .optional();

export const postReportInputSchema = postGetInputSchema.extend({
    reason: postReportReasonSchema,
});

/** Resolve or dismiss — never set back to open via this mutation. */
export const POST_REPORT_RESOLVE_ACTIONS = ['resolved', 'dismissed'] as const;

export const postReportResolveActionSchema = z.enum(
    POST_REPORT_RESOLVE_ACTIONS,
);

export const POST_REPORT_NOTE_MAX_LENGTH = 500;

export const postResolveReportInputSchema = groupSlugInputSchema.extend({
    reportId: z.string().min(1),
    action: postReportResolveActionSchema,
    note: z.string().trim().max(POST_REPORT_NOTE_MAX_LENGTH).optional(),
});

export const postListReportsInputSchema = groupSlugInputSchema.extend({
    status: postReportStatusSchema.default('open'),
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(50).default(20),
});

export const postReportSchema = z.object({
    id: z.string(),
    postId: z.string(),
    groupId: z.string(),
    reporterId: z.string(),
    reason: z.string().nullable(),
    status: postReportStatusSchema,
    resolverId: z.string().nullable(),
    resolveNote: z.string().nullable(),
    resolvedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    reporter: membershipUserSummarySchema.optional(),
    resolver: membershipUserSummarySchema.optional(),
    /** Post snippet for the moderation queue. */
    post: z
        .object({
            id: z.string(),
            body: z.string(),
            authorId: z.string(),
            author: membershipUserSummarySchema.optional(),
            createdAt: z.string(),
        })
        .optional(),
});

export const postReportListPageSchema = z.object({
    items: z.array(postReportSchema),
    nextCursor: z.string().nullable(),
});

export type PostTypeDto = (typeof POST_TYPES)[number];
export type PostDto = z.infer<typeof postSchema>;
export type PostListInput = z.infer<typeof postListInputSchema>;
export type PostListPageDto = z.infer<typeof postListPageSchema>;
export type PostCreateInput = z.infer<typeof postCreateInputSchema>;
export type PostGetInput = z.infer<typeof postGetInputSchema>;
export type PostUpdateInput = z.infer<typeof postUpdateInputSchema>;
export type PostLikeResultDto = z.infer<typeof postLikeResultSchema>;
export type PostPinResultDto = z.infer<typeof postPinResultSchema>;
export type PostReportStatusDto = (typeof POST_REPORT_STATUSES)[number];
export type PostReportResolveActionDto =
    (typeof POST_REPORT_RESOLVE_ACTIONS)[number];
export type PostReportDto = z.infer<typeof postReportSchema>;
export type PostReportInput = z.infer<typeof postReportInputSchema>;
export type PostListReportsInput = z.infer<typeof postListReportsInputSchema>;
export type PostReportListPageDto = z.infer<typeof postReportListPageSchema>;
export type PostResolveReportInput = z.infer<
    typeof postResolveReportInputSchema
>;

export function serializePost(post: {
    id: string;
    groupId: string;
    authorId: string;
    categoryId: string | null;
    body: string;
    type: PostTypeDto;
    pinned: boolean;
    broadcastEmail: boolean;
    createdAt: Date;
    updatedAt: Date;
    author?: {
        id: string;
        username: string;
        name: string | null;
        avatarUrl: string | null;
    } | null;
    commentCount?: number;
    likeCount?: number;
    likedByViewer?: boolean;
}): PostDto {
    return {
        id: post.id,
        groupId: post.groupId,
        authorId: post.authorId,
        categoryId: post.categoryId,
        body: post.body,
        type: post.type,
        pinned: post.pinned,
        broadcastEmail: post.broadcastEmail,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        ...(post.author
            ? { author: serializeMembershipUserSummary(post.author) }
            : {}),
        ...(typeof post.commentCount === 'number'
            ? { commentCount: post.commentCount }
            : {}),
        ...(typeof post.likeCount === 'number'
            ? { likeCount: post.likeCount }
            : {}),
        ...(typeof post.likedByViewer === 'boolean'
            ? { likedByViewer: post.likedByViewer }
            : {}),
    };
}

export function serializePostReport(report: {
    id: string;
    postId: string;
    groupId: string;
    reporterId: string;
    reason: string | null;
    status: PostReportStatusDto;
    resolverId: string | null;
    resolveNote: string | null;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    reporter?: {
        id: string;
        username: string;
        name: string | null;
        avatarUrl: string | null;
    } | null;
    resolver?: {
        id: string;
        username: string;
        name: string | null;
        avatarUrl: string | null;
    } | null;
    post?: {
        id: string;
        body: string;
        authorId: string;
        createdAt: Date;
        author?: {
            id: string;
            username: string;
            name: string | null;
            avatarUrl: string | null;
        } | null;
    } | null;
}): PostReportDto {
    return {
        id: report.id,
        postId: report.postId,
        groupId: report.groupId,
        reporterId: report.reporterId,
        reason: report.reason,
        status: report.status,
        resolverId: report.resolverId,
        resolveNote: report.resolveNote,
        resolvedAt: report.resolvedAt ? report.resolvedAt.toISOString() : null,
        createdAt: report.createdAt.toISOString(),
        updatedAt: report.updatedAt.toISOString(),
        ...(report.reporter
            ? { reporter: serializeMembershipUserSummary(report.reporter) }
            : {}),
        ...(report.resolver
            ? { resolver: serializeMembershipUserSummary(report.resolver) }
            : {}),
        ...(report.post
            ? {
                  post: {
                      id: report.post.id,
                      body: report.post.body,
                      authorId: report.post.authorId,
                      createdAt: report.post.createdAt.toISOString(),
                      ...(report.post.author
                          ? {
                                author: serializeMembershipUserSummary(
                                    report.post.author,
                                ),
                            }
                          : {}),
                  },
              }
            : {}),
    };
}
