export type PostBodyFormData = {
    body: string;
};

export type CreatePostFormData = PostBodyFormData & {
    /** Empty string = none / uncategorized. */
    categoryId?: string;
};

export type EditPostFormData = PostBodyFormData & {
    /** Empty string = none / uncategorized. */
    categoryId?: string;
};
