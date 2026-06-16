'use client';

import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { PasswordChangeFormData } from '../../model/types/types';
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
    PASSWORD_VALIDATION,
    REPEAT_PASSWORD_VALIDATION,
} from '@/src/shared/config/forms/fieldValidation';

interface PasswordChangeFormProps {
    className?: string;
    onSubmit?: (data: PasswordChangeFormData) => void;
}

export const PasswordChangeForm = memo(
    ({ className, onSubmit }: PasswordChangeFormProps) => {
        const { t } = useTranslation(['common']);
        const [showOldPassword, setShowOldPassword] = useState(false);
        const [showNewPassword, setShowNewPassword] = useState(false);
        const [showRepeatNewPassword, setShowRepeatNewPassword] =
            useState(false);

        const submitFormHandler = async (data: PasswordChangeFormData) => {
            try {
                console.log('password change data', data);
                onSubmit?.(data);
            } catch (error) {
                console.log('error from password change form', error);
            }
        };

        const {
            register,
            handleSubmit,
            formState: { errors, isValid },
        } = useForm<PasswordChangeFormData>({
            mode: 'onChange',
            defaultValues: {
                oldPassword: '',
                newPassword: '',
                repeatNewPassword: '',
            },
        });

        return (
            <form
                onSubmit={handleSubmit(submitFormHandler)}
                noValidate
            >
                <FieldGroup className={cn('auth-form__wrapper', className)}>
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
                        className="mb-8"
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
                                {...register(
                                    'repeatNewPassword',
                                    REPEAT_PASSWORD_VALIDATION(t),
                                )}
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

                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.create')}
                        disabled={!isValid}
                    >
                        {t('common:form.button.create')}
                    </Button>
                </FieldGroup>
            </form>
        );
    },
);

PasswordChangeForm.displayName = 'PasswordChangeForm';
