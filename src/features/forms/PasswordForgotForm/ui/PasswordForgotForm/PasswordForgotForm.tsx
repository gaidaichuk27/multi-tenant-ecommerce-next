'use client';

import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LogInIcon } from 'lucide-react';

import { PasswordForgotFormData } from '../../model/types/types';
import { Button } from '@shared/ui/Form/Button';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@shared/ui/Form';
import { EMAIL_VALIDATION } from '@shared/config/forms/fieldValidation';

import cn from 'classnames';

interface PasswordForgotFormProps {
    className?: string;
    onSubmit?: (data: PasswordForgotFormData) => void;
}

export const PasswordForgotForm = memo(
    ({ className, onSubmit }: PasswordForgotFormProps) => {
        const { t } = useTranslation(['common']);
        const submitFormHandler = async (data: PasswordForgotFormData) => {
            try {
                console.log('password forgot data', data);
                onSubmit?.(data);
            } catch (error) {
                console.log('error from password forgot form', error);
            }
        };

        const {
            register,
            handleSubmit,
            formState: { errors, isValid },
        } = useForm<PasswordForgotFormData>({
            mode: 'onChange',
            defaultValues: { email: '' },
        });

        return (
            <form
                onSubmit={handleSubmit(submitFormHandler)}
                noValidate
            >
                <FieldGroup className={cn('auth-form__wrapper', className)}>
                    <Field aria-invalid={Boolean(errors.email?.message)}>
                        <FieldLabel htmlFor="email">
                            {t('common:form.placeholder.email')}
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

                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.send')}
                        disabled={!isValid}
                    >
                        {t('common:form.button.send')}
                    </Button>
                </FieldGroup>
            </form>
        );
    },
);

PasswordForgotForm.displayName = 'PasswordForgotForm';
