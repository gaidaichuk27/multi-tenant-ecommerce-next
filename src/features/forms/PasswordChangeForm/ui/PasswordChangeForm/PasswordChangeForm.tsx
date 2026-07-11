'use client';

import { memo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { PasswordChangeFormData } from '../../model/types/types';
import { changePassword } from '@lib/auth/password-client-api';
import { PASSWORD_AUTH_ENABLED } from '@shared/config/auth';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@shared/ui/Form';
import {
    PASSWORD_VALIDATION,
    REPEAT_PASSWORD_VALIDATION,
} from '@shared/config/forms/fieldValidation';

interface PasswordChangeFormProps {
    className?: string;
}

export const PasswordChangeForm = memo(
    ({ className }: PasswordChangeFormProps) => {
        const { t } = useTranslation(['common']);
        const getSubmitError = useFormApiError();
        const router = useRouter();
        const [showOldPassword, setShowOldPassword] = useState(false);
        const [showNewPassword, setShowNewPassword] = useState(false);
        const [showRepeatNewPassword, setShowRepeatNewPassword] =
            useState(false);
        const [submitError, setSubmitError] = useState<string | null>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const {
            register,
            handleSubmit,
            watch,
            formState: { errors, isValid },
        } = useForm<PasswordChangeFormData>({
            mode: 'onChange',
            defaultValues: {
                oldPassword: '',
                newPassword: '',
                repeatNewPassword: '',
            },
        });

        const newPassword = watch('newPassword');

        const submitFormHandler = async ({
            oldPassword,
            newPassword: password,
        }: PasswordChangeFormData) => {
            try {
                setSubmitError(null);
                setIsSubmitting(true);

                await changePassword({
                    oldPassword,
                    newPassword: password,
                });

                router.refresh();
            } catch (error) {
                setSubmitError(getSubmitError(error));
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <form
                onSubmit={handleSubmit(submitFormHandler)}
                noValidate
            >
                <FieldGroup className={cn('auth-form__wrapper', className)}>
                    {!PASSWORD_AUTH_ENABLED && (
                        <p className="text-muted-foreground text-sm">
                            {t('common:auth.password.not_implemented')}
                        </p>
                    )}

                    <Field aria-invalid={Boolean(errors.oldPassword?.message)}>
                        <FieldLabel htmlFor="oldPassword">
                            {t('common:form.placeholder.password.old')}{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <LockIcon />
                            </InputGroupAddon>
                            <InputGroupInput
                                id="oldPassword"
                                type={showOldPassword ? 'text' : 'password'}
                                aria-invalid={Boolean(
                                    errors.oldPassword?.message,
                                )}
                                {...register(
                                    'oldPassword',
                                    PASSWORD_VALIDATION(t),
                                )}
                                placeholder={t(
                                    'common:form.placeholder.password.old',
                                )}
                            />
                            <InputGroupAddon align="inline-end">
                                {showOldPassword ? (
                                    <EyeOffIcon
                                        onClick={() =>
                                            setShowOldPassword(false)
                                        }
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <EyeIcon
                                        onClick={() => setShowOldPassword(true)}
                                        className="cursor-pointer"
                                    />
                                )}
                            </InputGroupAddon>
                        </InputGroup>
                        {errors.oldPassword?.message && (
                            <ErrorMessage error={errors.oldPassword.message} />
                        )}
                    </Field>

                    <Field aria-invalid={Boolean(errors.newPassword?.message)}>
                        <FieldLabel htmlFor="newPassword">
                            {t('common:form.placeholder.password.new')}{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <LockIcon />
                            </InputGroupAddon>
                            <InputGroupInput
                                id="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                aria-invalid={Boolean(
                                    errors.newPassword?.message,
                                )}
                                {...register(
                                    'newPassword',
                                    PASSWORD_VALIDATION(t),
                                )}
                                placeholder={t(
                                    'common:form.placeholder.password.new',
                                )}
                            />
                            <InputGroupAddon align="inline-end">
                                {showNewPassword ? (
                                    <EyeOffIcon
                                        onClick={() =>
                                            setShowNewPassword(false)
                                        }
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <EyeIcon
                                        onClick={() => setShowNewPassword(true)}
                                        className="cursor-pointer"
                                    />
                                )}
                            </InputGroupAddon>
                        </InputGroup>
                        {errors.newPassword?.message && (
                            <ErrorMessage error={errors.newPassword.message} />
                        )}
                    </Field>

                    <Field
                        aria-invalid={Boolean(
                            errors.repeatNewPassword?.message,
                        )}
                        className="mb-6"
                    >
                        <FieldLabel htmlFor="repeatNewPassword">
                            {t('common:form.placeholder.password.repeat')}{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <LockIcon />
                            </InputGroupAddon>
                            <InputGroupInput
                                id="repeatNewPassword"
                                type={
                                    showRepeatNewPassword ? 'text' : 'password'
                                }
                                aria-invalid={Boolean(
                                    errors.repeatNewPassword?.message,
                                )}
                                {...register('repeatNewPassword', {
                                    ...REPEAT_PASSWORD_VALIDATION(t),
                                    validate: (value) =>
                                        value === newPassword ||
                                        t(
                                            'common:form.validation.passwords.should.match',
                                        ),
                                })}
                                placeholder={t(
                                    'common:form.placeholder.password.repeat',
                                )}
                            />
                            <InputGroupAddon align="inline-end">
                                {showRepeatNewPassword ? (
                                    <EyeOffIcon
                                        onClick={() =>
                                            setShowRepeatNewPassword(false)
                                        }
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <EyeIcon
                                        onClick={() =>
                                            setShowRepeatNewPassword(true)
                                        }
                                        className="cursor-pointer"
                                    />
                                )}
                            </InputGroupAddon>
                        </InputGroup>
                        {errors.repeatNewPassword?.message && (
                            <ErrorMessage
                                error={errors.repeatNewPassword.message}
                            />
                        )}
                    </Field>

                    {submitError && <ErrorMessage error={submitError} />}

                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.create')}
                        disabled={
                            !PASSWORD_AUTH_ENABLED || !isValid || isSubmitting
                        }
                    >
                        {isSubmitting
                            ? t('common:loading')
                            : t('common:form.button.create')}
                    </Button>
                </FieldGroup>
            </form>
        );
    },
);

PasswordChangeForm.displayName = 'PasswordChangeForm';
