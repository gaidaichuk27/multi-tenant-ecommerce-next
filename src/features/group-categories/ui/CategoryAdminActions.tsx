'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
    CATEGORY_NAME_MAX_LENGTH,
    CATEGORY_T_MESSAGES,
    type CategoryDto,
} from '@repo/api';
import { useModal } from '@entities/Modal';
import {
    deleteCategory,
    reorderCategories,
    updateCategory,
} from '@lib/categories/client-api';
import { maxLengthValidation } from '@shared/config/forms/fieldValidation';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Input } from '@shared/ui/Form/Input';

type RenameFormData = {
    name: string;
};

interface CategoryAdminActionsProps {
    groupSlug: string;
    category: CategoryDto;
    orderedIds: string[];
    canMoveUp: boolean;
    canMoveDown: boolean;
    /** Shared across rows so concurrent list mutations cannot race. */
    listBusy: boolean;
    runListBusy: (action: () => Promise<void>) => Promise<void>;
    onReordered: (orderedIds: string[]) => void;
    renameLabel: string;
    saveLabel: string;
    cancelLabel: string;
    deleteLabel: string;
    moveUpLabel: string;
    moveDownLabel: string;
}

export function CategoryAdminActions({
    groupSlug,
    category,
    orderedIds,
    canMoveUp,
    canMoveDown,
    listBusy,
    runListBusy,
    onReordered,
    renameLabel,
    saveLabel,
    cancelLabel,
    deleteLabel,
    moveUpLabel,
    moveDownLabel,
}: CategoryAdminActionsProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const { confirm } = useModal();
    const [isEditing, setIsEditing] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isValid },
    } = useForm<RenameFormData>({
        mode: 'onChange',
        defaultValues: { name: category.name },
    });

    const refresh = () => router.refresh();
    const actionsDisabled = isBusy || listBusy;

    const withBusy = async (action: () => Promise<void>) => {
        try {
            setIsBusy(true);
            await action();
            // Clear only after success so a retry does not flash away the prior error.
            setSubmitError(null);
        } catch (error) {
            const message = getSubmitError(error);
            setSubmitError(message);
            toast.error(message);
        } finally {
            setIsBusy(false);
        }
    };

    const onRename = async (data: RenameFormData) => {
        await withBusy(async () => {
            try {
                await updateCategory(groupSlug, category.id, data.name.trim());
                clearErrors();
                reset({ name: data.name.trim() });
                setIsEditing(false);
                toast.success(
                    t(`common:${CATEGORY_T_MESSAGES.UPDATE_SUCCESS}`),
                );
                refresh();
            } catch (error) {
                // Keep attempted values in the form (same pattern as CreateCategoryForm).
                reset(data);
                throw error;
            }
        });
    };

    const onDelete = async () => {
        // Hold list lock for the whole confirm → mutate path so Move cannot
        // race while the dialog is open (would toast REORDER_INVALID).
        await runListBusy(async () => {
            const confirmed = await confirm({
                title: deleteLabel,
                description: t('common:group.categories.delete_confirm'),
                confirmLabel: deleteLabel,
                cancelLabel: t('common:modal.cancel'),
                destructive: true,
            });
            if (!confirmed) return;

            try {
                await deleteCategory(groupSlug, category.id);
                onReordered(orderedIds.filter((id) => id !== category.id));
                setSubmitError(null);
                toast.success(
                    t(`common:${CATEGORY_T_MESSAGES.DELETE_SUCCESS}`),
                );
                refresh();
            } catch (error) {
                const message = getSubmitError(error);
                setSubmitError(message);
                toast.error(message);
            }
        });
    };

    const move = async (direction: -1 | 1) => {
        const index = orderedIds.indexOf(category.id);
        if (index < 0) return;
        const next = index + direction;
        if (next < 0 || next >= orderedIds.length) return;

        const nextOrder = [...orderedIds];
        const [removed] = nextOrder.splice(index, 1);
        if (!removed) return;
        nextOrder.splice(next, 0, removed);

        await runListBusy(async () => {
            try {
                await reorderCategories(groupSlug, nextOrder);
                onReordered(nextOrder);
                setSubmitError(null);
                toast.success(
                    t(`common:${CATEGORY_T_MESSAGES.REORDER_SUCCESS}`),
                );
                refresh();
            } catch (error) {
                const message = getSubmitError(error);
                setSubmitError(message);
                toast.error(message);
            }
        });
    };

    if (isEditing) {
        return (
            <form
                onSubmit={handleSubmit(onRename)}
                className="flex w-full flex-col gap-2 sm:max-w-xs"
            >
                <Input
                    maxLength={CATEGORY_NAME_MAX_LENGTH}
                    disabled={actionsDisabled}
                    aria-invalid={Boolean(errors.name?.message)}
                    {...register('name', {
                        required: t(
                            `common:${CATEGORY_T_MESSAGES.NAME_REQUIRED}`,
                        ),
                        validate: (value) =>
                            value.trim().length > 0 ||
                            t(`common:${CATEGORY_T_MESSAGES.NAME_REQUIRED}`),
                        ...maxLengthValidation(
                            t,
                            t('common:group.categories.name'),
                            CATEGORY_NAME_MAX_LENGTH,
                        ),
                    })}
                />
                {errors.name?.message ? (
                    <ErrorMessage error={errors.name.message} />
                ) : null}
                {submitError ? <ErrorMessage error={submitError} /> : null}
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="submit"
                        size="sm"
                        disabled={!isValid || actionsDisabled}
                    >
                        {saveLabel}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={actionsDisabled}
                        onClick={() => {
                            reset({ name: category.name });
                            setIsEditing(false);
                            setSubmitError(null);
                        }}
                    >
                        {cancelLabel}
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={actionsDisabled || !canMoveUp}
                    onClick={() => void move(-1)}
                >
                    {moveUpLabel}
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={actionsDisabled || !canMoveDown}
                    onClick={() => void move(1)}
                >
                    {moveDownLabel}
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={actionsDisabled}
                    onClick={() => {
                        reset({ name: category.name });
                        setIsEditing(true);
                    }}
                >
                    {renameLabel}
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={actionsDisabled}
                    onClick={() => void onDelete()}
                >
                    {deleteLabel}
                </Button>
            </div>
            {submitError ? <ErrorMessage error={submitError} /> : null}
        </div>
    );
}
