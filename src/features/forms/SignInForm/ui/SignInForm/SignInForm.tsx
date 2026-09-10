'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { AUTH_T_MESSAGES } from '@repo/api';
import { LogInIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { SignInFormData } from '@features/forms/SignInForm';
import { loginWithCredentials } from '@lib/auth/client-api';
import { safeRedirect } from '@lib/auth/safe-redirect';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/src/shared/ui/Form';
import { GoogleButton } from '@features/auth/buttons';
import {
    EMAIL_VALIDATION,
    LOGIN_PASSWORD_VALIDATION,
} from '@shared/config/forms/fieldValidation';

interface SignInFormProps {
    className?: string;
    locale: Language;
}

export const SignInForm = memo(({ className, locale }: SignInFormProps) => {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors, isValid },
    } = useForm<SignInFormData>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const submitFormHandler = async (data: SignInFormData) => {
        try {
            setIsSubmitting(true);
            await loginWithCredentials({
                email: data.email,
                password: data.password,
            });
            setSubmitError(null);
            clearErrors();
            toast.success(t(`common:${AUTH_T_MESSAGES.LOGIN_SUCCESS}`));

            const fallback = buildLocalizedPathname('/app', locale);
            const redirect = safeRedirect(
                searchParams.get('redirect'),
                fallback,
            );
            router.push(redirect);
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
                <Field aria-invalid={Boolean(errors.email?.message)}>
                    <FieldLabel htmlFor="email">
                        {t('common:form.placeholder.email')}{' '}
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupAddon>
                            <LogInIcon />
                        </InputGroupAddon>
                        <InputGroupInput
                            id="email"
                            type="email"
                            {...register('email', EMAIL_VALIDATION(t))}
                            placeholder={t('common:form.placeholder.email')}
                        />
                    </InputGroup>
                    {errors.email?.message && (
                        <ErrorMessage error={errors.email.message} />
                    )}
                </Field>
                <Field aria-invalid={Boolean(errors.password?.message)}>
                    <FieldLabel htmlFor="password">
                        {t('common:form.placeholder.password')}{' '}
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupAddon>
                            <LockIcon />
                        </InputGroupAddon>
                        <InputGroupInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register(
                                'password',
                                LOGIN_PASSWORD_VALIDATION(t),
                            )}
                            placeholder={t('common:form.placeholder.password')}
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

                <div className="auth-form__actions">
                    <p className="auth-form__label">
                        <span>{t('common:form.label.password.forgot')}</span>
                    </p>
                    <p className="auth-form__link">
                        <Link
                            href={buildLocalizedPathname(
                                '/password-forgot',
                                locale,
                            )}
                        >
                            {t('common:form.link.password.restore')}
                        </Link>
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    {submitError && <ErrorMessage error={submitError} />}

                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.signin')}
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting
                            ? t('common:loading')
                            : t('common:form.button.signin')}
                    </Button>

                    <GoogleButton />
                </div>
            </FieldGroup>
        </form>
    );
});

SignInForm.displayName = 'SignInForm';
