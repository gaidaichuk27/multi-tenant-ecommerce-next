'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { buildLocalizedPathname } from '@shared/config/locales/locale';
import type { Language } from '@shared/config/locales/types';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import {
    LogInIcon,
    LockIcon,
    EyeIcon,
    EyeOffIcon,
    UserIcon,
} from 'lucide-react';

import { RegisterFormData } from '../../model/types/types';
import { AUTH_T_MESSAGES } from '@repo/api';
import { registerAccount } from '@lib/auth/client-api';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@shared/ui/Form';

import {
    EMAIL_VALIDATION,
    PASSWORD_VALIDATION,
    REPEAT_PASSWORD_VALIDATION,
    USERNAME_VALIDATION,
} from '@shared/config/forms/fieldValidation';

interface RegisterFormProps {
    className?: string;
    locale: Language;
}

export const RegisterForm = memo(({ className, locale }: RegisterFormProps) => {
    const { t } = useTranslation(['common']);
    const getSubmitError = useFormApiError();
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        watch,
        formState: { errors, isValid },
    } = useForm<RegisterFormData>({
        mode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            repeatPassword: '',
        },
    });

    const password = watch('password');

    const submitFormHandler = async (data: RegisterFormData) => {
        try {
            setIsSubmitting(true);
            await registerAccount({
                username: data.username,
                email: data.email,
                password: data.password,
                locale,
            });
            setSubmitError(null);
            clearErrors();
            toast.success(t(`common:${AUTH_T_MESSAGES.REGISTER_CHECK_EMAIL}`));
            router.push(buildLocalizedPathname('/app', locale));
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
                <Field aria-invalid={Boolean(errors.username?.message)}>
                    <FieldLabel htmlFor="username">
                        {t('common:form.placeholder.username')}{' '}
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupAddon>
                            <UserIcon />
                        </InputGroupAddon>
                        <InputGroupInput
                            id="username"
                            type="text"
                            aria-invalid={Boolean(errors.username?.message)}
                            {...register('username', USERNAME_VALIDATION(t))}
                            placeholder={t('common:form.placeholder.username')}
                        />
                    </InputGroup>
                    {errors.username?.message && (
                        <ErrorMessage error={errors.username.message} />
                    )}
                </Field>

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
                            aria-invalid={Boolean(errors.email?.message)}
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
                            aria-invalid={Boolean(errors.password?.message)}
                            {...register('password', PASSWORD_VALIDATION(t))}
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

                <Field aria-invalid={Boolean(errors.repeatPassword?.message)}>
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
                                    onClick={() => setShowRepeatPassword(false)}
                                    className="cursor-pointer"
                                />
                            ) : (
                                <EyeIcon
                                    onClick={() => setShowRepeatPassword(true)}
                                    className="cursor-pointer"
                                />
                            )}
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.repeatPassword?.message && (
                        <ErrorMessage error={errors.repeatPassword.message} />
                    )}
                </Field>

                <div className="auth-form__actions">
                    <p className="auth-form__label">
                        <span>{t('common:form.label.have.account')}</span>
                    </p>
                    <p className="auth-form__link">
                        <Link href="/login">
                            {t('common:form.login.title')}
                        </Link>
                    </p>
                </div>

                {submitError && <ErrorMessage error={submitError} />}

                <Button
                    type="submit"
                    className="auth-form__button"
                    aria-label={t('common:form.button.register')}
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting
                        ? t('common:loading')
                        : t('common:form.button.register')}
                </Button>
            </FieldGroup>
        </form>
    );
});

RegisterForm.displayName = 'RegisterForm';
