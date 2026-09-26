import type { CategoryDto } from '@repo/api';
import {
    CategoriesAdminList,
    CreateCategoryForm,
} from '@features/group-categories';

interface CategoriesListViewProps {
    groupSlug: string;
    title: string;
    emptyLabel: string;
    hintLabel: string;
    renameLabel: string;
    saveLabel: string;
    cancelLabel: string;
    deleteLabel: string;
    moveUpLabel: string;
    moveDownLabel: string;
    categories: CategoryDto[];
}

/** Server view — interactive list lives in {@link CategoriesAdminList}. */
export function CategoriesListView({
    groupSlug,
    title,
    emptyLabel,
    hintLabel,
    renameLabel,
    saveLabel,
    cancelLabel,
    deleteLabel,
    moveUpLabel,
    moveDownLabel,
    categories,
}: CategoriesListViewProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="mb-1 text-lg font-semibold">{title}</h2>
                <p className="text-muted-foreground mb-4 text-sm">
                    {hintLabel}
                </p>
                <CreateCategoryForm
                    groupSlug={groupSlug}
                    categoryCount={categories.length}
                />
            </div>

            <CategoriesAdminList
                groupSlug={groupSlug}
                emptyLabel={emptyLabel}
                renameLabel={renameLabel}
                saveLabel={saveLabel}
                cancelLabel={cancelLabel}
                deleteLabel={deleteLabel}
                moveUpLabel={moveUpLabel}
                moveDownLabel={moveDownLabel}
                categories={categories}
            />
        </div>
    );
}
