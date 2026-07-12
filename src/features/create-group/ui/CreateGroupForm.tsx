'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { GROUP_T_MESSAGES } from '@repo/api';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { createGroup } from '@lib/groups/client-api';
import { Button } from '@shared/ui/Form/Button';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { InputGroup, InputGroupInput } from '@shared/ui/Form';
import { cn } from '@lib/utils';

import type { CreateGroupFormData } from '../model/types';
import {
    GROUP_DESCRIPTION_VALIDATION,
    GROUP_NAME_VALIDATION,
    GROUP_SLUG_VALIDATION,
} from '@/src/shared/config/forms/fieldValidation';

function slugifyName(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

interface CreateGroupFormProps {
    className?: string;
    locale: Language;
}

export function CreateGroupForm({ className, locale }: CreateGroupFormProps) {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const router = useRouter();
    const slugTouchedRef = useRef(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        setValue,
        formState: { errors, isValid },
    } = useForm<CreateGroupFormData>({
        mode: 'onChange',
        defaultValues: {
            name: '',
            slug: '',
            description: '',
        },
    });

    const nameField = register('name', GROUP_NAME_VALIDATION(t));
    const slugField = register('slug', GROUP_SLUG_VALIDATION(t));

    const submitFormHandler = async (data: CreateGroupFormData) => {
        try {
            setIsSubmitting(true);

            const group = await createGroup({
                name: data.name.trim(),
                slug: data.slug.trim(),
                description: data.description.trim() || undefined,
            });

            setSubmitError(null);
            clearErrors();
            toast.success(t(`common:${GROUP_T_MESSAGES.CREATE_SUCCESS}`));
            router.push(buildLocalizedPathname(`/${group.slug}/about`, locale));
            router.refresh();
        } catch (error) {
            reset(data);
            const message = getSubmitError(error);
            setSubmitError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(submitFormHandler)}
            noValidate
            className={cn(className)}
        >
            <FieldGroup>
                <Field aria-invalid={Boolean(errors.name?.message)}>
                    <FieldLabel htmlFor="group-name">
                        {t('common:group.form.name')}{' '}
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id="group-name"
                            aria-invalid={Boolean(errors.name?.message)}
                            {...nameField}
                            onChange={(event) => {
                                nameField.onChange(event);

                                if (!slugTouchedRef.current) {
                                    setValue(
                                        'slug',
                                        slugifyName(event.target.value),
                                        { shouldValidate: true },
                                    );
                                }
                            }}
                            placeholder={t('common:group.form.name')}
                        />
                    </InputGroup>
                    {errors.name?.message && (
                        <ErrorMessage error={errors.name.message} />
                    )}
                </Field>

                <Field aria-invalid={Boolean(errors.slug?.message)}>
                    <FieldLabel htmlFor="group-slug">
                        {t('common:group.form.slug')}{' '}
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id="group-slug"
                            aria-invalid={Boolean(errors.slug?.message)}
                            {...slugField}
                            onChange={(event) => {
                                slugTouchedRef.current = true;
                                setValue(
                                    'slug',
                                    event.target.value.toLowerCase(),
                                    { shouldValidate: true },
                                );
                            }}
                            placeholder={t(
                                'common:group.form.slug.placeholder',
                            )}
                        />
                    </InputGroup>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {t('common:group.form.slug.hint')}
                    </p>
                    {errors.slug?.message && (
                        <ErrorMessage error={errors.slug.message} />
                    )}
                </Field>

                <Field aria-invalid={Boolean(errors.description?.message)}>
                    <FieldLabel htmlFor="group-description">
                        {t('common:group.form.description')}
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id="group-description"
                            aria-invalid={Boolean(errors.description?.message)}
                            {...register(
                                'description',
                                GROUP_DESCRIPTION_VALIDATION(t),
                            )}
                            placeholder={t('common:group.form.description')}
                        />
                    </InputGroup>
                    {errors.description?.message && (
                        <ErrorMessage error={errors.description.message} />
                    )}
                </Field>

                {submitError && <ErrorMessage error={submitError} />}

                <div className="flex gap-3">
                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting
                            ? t('common:loading')
                            : t('common:group.form.submit')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        asChild
                    >
                        <Link href={buildLocalizedPathname('/app', locale)}>
                            {t('common:form.button.home')}
                        </Link>
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
