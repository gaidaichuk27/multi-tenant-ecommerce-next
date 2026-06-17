'use client';

import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

import { PasswordRestoreFormData } from '../../model/types/types';
import { Button } from '@shared/ui/Form/Button';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@shared/ui/Form';
import {
    PASSWORD_VALIDATION,
    REPEAT_PASSWORD_VALIDATION,
} from '@shared/config/forms/fieldValidation';

import cn from 'classnames';

interface PasswordRestoreFormProps {
    className?: string;
    onSubmit?: (data: PasswordRestoreFormData) => void;
}

export const PasswordRestoreForm = memo(
    ({ className, onSubmit }: PasswordRestoreFormProps) => {
        const { t } = useTranslation(['common']);

        const [showPassword, setShowPassword] = useState(false);
        const [showRepeatPassword, setShowRepeatPassword] = useState(false);

        const submitFormHandler = async (data: PasswordRestoreFormData) => {
            try {
                console.log('password restore data', data);
                onSubmit?.(data);
            } catch (error) {
                console.log('error from password restore form', error);
            }
        };

        const {
            register,
            handleSubmit,
            watch,
            formState: { errors, isValid },
        } = useForm<PasswordRestoreFormData>({
            mode: 'onChange',
            defaultValues: {
                password: '',
                repeatPassword: '',
            },
        });

        const password = watch('password');

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

                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.restore')}
                        disabled={!isValid}
                    >
                        {t('common:form.button.restore')}
                    </Button>
                </FieldGroup>
            </form>
        );
    },
);

PasswordRestoreForm.displayName = 'PasswordRestoreForm';
