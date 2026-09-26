export const CATEGORY_T_MESSAGES = {
    NOT_FOUND: 'category.not_found',
    CREATE_SUCCESS: 'category.create.success',
    UPDATE_SUCCESS: 'category.update.success',
    DELETE_SUCCESS: 'category.delete.success',
    REORDER_SUCCESS: 'category.reorder.success',
    NAME_REQUIRED: 'category.name.required',
    NAME_TAKEN: 'category.name.taken',
    MAX_REACHED: 'category.max_reached',
    REORDER_INVALID: 'category.reorder.invalid',
} as const;

export type CategoryTMessage =
    (typeof CATEGORY_T_MESSAGES)[keyof typeof CATEGORY_T_MESSAGES];
