'use client';

import { memo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { PasswordRestoreFormData } from '../../model/types/types';
import { restorePassword } from '@lib/auth/password-client-api';
import { AUTH_T_MESSAGES } from '@repo/api';
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

interface PasswordRestoreFormProps {
    className?: string;
    locale: Language;
}

export const PasswordRestoreForm = memo(
    ({ className, locale }: PasswordRestoreFormProps) => {
        const { t } = useTranslation(['common']);
        const getSubmitError = useFormApiError();
        const router = useRouter();
        const searchParams = useSearchParams();
        const [showPassword, setShowPassword] = useState(false);
        const [showRepeatPassword, setShowRepeatPassword] = useState(false);
        const [submitError, setSubmitError] = useState<string | null>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const {
            register,
            handleSubmit,
            watch,
            reset,
            clearErrors,
            formState: { errors, isValid },
        } = useForm<PasswordRestoreFormData>({
            mode: 'onChange',
            defaultValues: {
                password: '',
                repeatPassword: '',
            },
        });

        const password = watch('password');

        const submitFormHandler = async (data: PasswordRestoreFormData) => {
            const token = searchParams.get('token');

            if (!token) {
                const message = t('common:auth.password.restore.token_missing');
                setSubmitError(message);
                toast.error(message);
                return;
            }

            try {
                setIsSubmitting(true);

                await restorePassword({
                    password: data.password,
                    token,
                });

                setSubmitError(null);
                clearErrors();
                toast.success(
                    t(`common:${AUTH_T_MESSAGES.PASSWORD_RESTORE_SUCCESS}`),
                );
                router.push(buildLocalizedPathname('/login', locale));
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
            >
                <FieldGroup className={cn('auth-form__wrapper', className)}>
                    <Field aria-invalid={Boolean(errors.password?.message)}>
                        <FieldLabel htmlFor="password">
                            {t('common:form.placeholder.password.new')}{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <LockIcon />
                            </InputGroupAddon>
                            <InputGroupInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                aria-invalid={Boolean(errors.password?.message)}
                                {...register(
                                    'password',
                                    PASSWORD_VALIDATION(t),
                                )}
                                placeholder={t(
                                    'common:form.placeholder.password.new',
                                )}
                            />
                            <InputGroupAddon align="inline-end">
                                {showPassword ? (
                                    <EyeOffIcon
                                        onClick={() => setShowPassword(false)}
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <EyeIcon
                                        onClick={() => setShowPassword(true)}
                                        className="cursor-pointer"
                                    />
                                )}
                            </InputGroupAddon>
                        </InputGroup>

                        {errors.password?.message && (
                            <ErrorMessage error={errors.password.message} />
                        )}
                    </Field>

                    <Field
                        aria-invalid={Boolean(errors.repeatPassword?.message)}
                        className="mb-6"
                    >
                        <FieldLabel htmlFor="repeatPassword">
                            {t('common:form.placeholder.password.repeat')}{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon>
                                <LockIcon />
                            </InputGroupAddon>
                            <InputGroupInput
                                id="repeatPassword"
                                type={showRepeatPassword ? 'text' : 'password'}
                                aria-invalid={Boolean(
                                    errors.repeatPassword?.message,
                                )}
                                {...register('repeatPassword', {
                                    ...REPEAT_PASSWORD_VALIDATION(t),
                                    validate: (value) =>
                                        value === password ||
                                        t(
                                            'common:form.validation.passwords.should.match',
                                        ),
                                })}
                                placeholder={t(
                                    'common:form.placeholder.password.repeat',
                                )}
                            />
                            <InputGroupAddon align="inline-end">
                                {showRepeatPassword ? (
                                    <EyeOffIcon
                                        onClick={() =>
                                            setShowRepeatPassword(false)
                                        }
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <EyeIcon
                                        onClick={() =>
                                            setShowRepeatPassword(true)
                                        }
                                        className="cursor-pointer"
                                    />
                                )}
                            </InputGroupAddon>
                        </InputGroup>

                        {errors.repeatPassword?.message && (
                            <ErrorMessage
                                error={errors.repeatPassword.message}
                            />
                        )}
                    </Field>

                    {submitError && <ErrorMessage error={submitError} />}

                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.restore')}
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting
                            ? t('common:loading')
                            : t('common:form.button.restore')}
                    </Button>
                </FieldGroup>
            </form>
        );
    },
);

PasswordRestoreForm.displayName = 'PasswordRestoreForm';
