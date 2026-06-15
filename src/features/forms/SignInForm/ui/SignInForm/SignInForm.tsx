'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SignInFormData } from '@features/forms/SignInForm';
import { Button } from '@shared/ui/Form/Button';
// import { useNotification } from '@shared/ui/Notification';
import { LogInIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { cn } from '@lib/utils';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/src/shared/ui/Form/InputGroup';
import { GoogleButton } from '@features/auth/buttons';

interface SignInFormProps {
    className?: string;
    onSubmit?: (data: SignInFormData) => void;
}

export const SignInForm = memo(({ className, onSubmit }: SignInFormProps) => {
    const { t } = useTranslation(['common']);
    const [showPassword, setShowPassword] = useState(false);
    // const { notify } = useNotification({
    //     type: 'error',
    //     title: `${notifyMessage}`,
    // });

    // useEffect(() => {
    //     if (notifyMessage) {
    //         notify();
    //     }

    //     return () => {
    //         setNotifyMessage('');
    //     };
    // }, [notify, notifyMessage]);

    const submitFormHandler = async ({ email, password }: SignInFormData) => {
        try {
            console.log('email', email);
            console.log('password', password);
            onSubmit?.({ email, password });
            // const response = await signIn('credentials', {
            //     email,
            //     password,
            //     redirect: false,
            //     callbackUrl: `/${locale}`,
            // });
            // onSubmit?.({ email, password });
            // if (response?.error) {
            //     setNotifyMessage(response.error);
            //     return;
            // }
            // router.push('/');
        } catch (error) {
            console.log('error from signIn form', error);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SignInFormData>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });
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
                            {...register('email', {
                                required: t('common:form.validation.required', {
                                    field: t('common:form.placeholder.email'),
                                }),
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g,
                                    message: t(
                                        'common:form.validation.email.invalid',
                                    ),
                                },
                            })}
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
                            {...register('password', {
                                required: t('common:form.validation.required', {
                                    field: t(
                                        'common:form.placeholder.password',
                                    ),
                                }),
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: t(
                                        'common:form.validation.password.pattern',
                                    ),
                                },
                            })}
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
                        <Link href="/password-forgot">
                            {t('common:form.link.password.restore')}
                        </Link>
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.signin')}
                        disabled={!isValid}
                    >
                        {t('common:form.button.signin')}
                    </Button>

                    <GoogleButton />
                </div>
            </FieldGroup>
        </form>
    );
});

SignInForm.displayName = 'SignInForm';
