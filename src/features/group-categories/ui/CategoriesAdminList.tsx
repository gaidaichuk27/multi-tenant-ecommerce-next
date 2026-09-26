'use client';

import { useEffect, useRef, useState } from 'react';
import type { CategoryDto } from '@repo/api';

import { CategoryAdminActions } from './CategoryAdminActions';

interface CategoriesAdminListProps {
    groupSlug: string;
    emptyLabel: string;
    renameLabel: string;
    saveLabel: string;
    cancelLabel: string;
    deleteLabel: string;
    moveUpLabel: string;
    moveDownLabel: string;
    categories: CategoryDto[];
}

/**
 * Client island that owns shared reorder busy state so concurrent Move clicks
 * cannot race with stale full permutations.
 */
export function CategoriesAdminList({
    groupSlug,
    emptyLabel,
    renameLabel,
    saveLabel,
    cancelLabel,
    deleteLabel,
    moveUpLabel,
    moveDownLabel,
    categories,
}: CategoriesAdminListProps) {
    const [orderedIds, setOrderedIds] = useState(() =>
        categories.map((category) => category.id),
    );
    const [isListBusy, setIsListBusy] = useState(false);
    const listBusyRef = useRef(false);

    useEffect(() => {
        setOrderedIds(categories.map((category) => category.id));
    }, [categories]);

    const byId = new Map(
        categories.map((category) => [category.id, category] as const),
    );
    const orderedCategories = orderedIds
        .map((id) => byId.get(id))
        .filter((category): category is CategoryDto => Boolean(category));

    const runListBusy = async (action: () => Promise<void>) => {
        // Ref blocks concurrent Move clicks before React re-renders disabled state.
        if (listBusyRef.current) return;
        listBusyRef.current = true;
        setIsListBusy(true);
        try {
            await action();
        } finally {
            listBusyRef.current = false;
            setIsListBusy(false);
        }
    };

    if (orderedCategories.length === 0) {
        return <p className="text-muted-foreground text-sm">{emptyLabel}</p>;
    }

    return (
        <ul className="divide-border divide-y rounded-md border">
            {orderedCategories.map((category, index) => (
                <li
                    key={category.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="min-w-0 flex-1 font-medium">
                        {category.name}
                    </p>
                    <CategoryAdminActions
                        groupSlug={groupSlug}
                        category={category}
                        orderedIds={orderedIds}
                        canMoveUp={index > 0}
                        canMoveDown={index < orderedCategories.length - 1}
                        listBusy={isListBusy}
                        runListBusy={runListBusy}
                        onReordered={setOrderedIds}
                        renameLabel={renameLabel}
                        saveLabel={saveLabel}
                        cancelLabel={cancelLabel}
                        deleteLabel={deleteLabel}
                        moveUpLabel={moveUpLabel}
                        moveDownLabel={moveDownLabel}
                    />
                </li>
            ))}
        </ul>
    );
}
