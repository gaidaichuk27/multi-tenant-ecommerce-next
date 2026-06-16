'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
    LogInIcon,
    LockIcon,
    EyeIcon,
    EyeOffIcon,
    UserIcon,
} from 'lucide-react';

import { RegisterFormData } from '../../model/types/types';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/src/shared/ui/Form';

import {
    EMAIL_VALIDATION,
    PASSWORD_VALIDATION,
    REPEAT_PASSWORD_VALIDATION,
    USERNAME_VALIDATION,
} from '@/src/shared/config/forms/fieldValidation';

interface RegisterFormProps {
    className?: string;
    onSubmit?: (data: RegisterFormData) => void;
}

export const RegisterForm = memo(
    ({ className, onSubmit }: RegisterFormProps) => {
        const { t } = useTranslation(['common']);
        const [showPassword, setShowPassword] = useState(false);
        const [showRepeatPassword, setShowRepeatPassword] = useState(false);

        const submitFormHandler = async (data: RegisterFormData) => {
            try {
                console.log('register data', data);
                onSubmit?.(data);
            } catch (error) {
                console.log('error from register form', error);
            }
        };

        const {
            register,
            handleSubmit,
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
                                {...register(
                                    'username',
                                    USERNAME_VALIDATION(t),
                                )}
                                placeholder={t(
                                    'common:form.placeholder.username',
                                )}
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
                                {...register(
                                    'password',
                                    PASSWORD_VALIDATION(t),
                                )}
                                placeholder={t(
                                    'common:form.placeholder.password',
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
                                {...register(
                                    'repeatPassword',
                                    REPEAT_PASSWORD_VALIDATION(t),
                                )}
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

                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.register')}
                        disabled={!isValid}
                    >
                        {t('common:form.button.register')}
                    </Button>
                </FieldGroup>
            </form>
        );
    },
);

RegisterForm.displayName = 'RegisterForm';
