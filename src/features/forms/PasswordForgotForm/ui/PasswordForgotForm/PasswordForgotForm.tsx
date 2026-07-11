'use client';

import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LogInIcon } from 'lucide-react';

import { PasswordForgotFormData } from '../../model/types/types';
import { requestPasswordForgot } from '@lib/auth/password-client-api';
import { PASSWORD_AUTH_ENABLED } from '@shared/config/auth';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@shared/ui/Form';
import { EMAIL_VALIDATION } from '@shared/config/forms/fieldValidation';

interface PasswordForgotFormProps {
    className?: string;
}

export const PasswordForgotForm = memo(
    ({ className }: PasswordForgotFormProps) => {
        const { t } = useTranslation(['common']);
        const getSubmitError = useFormApiError();
        const [submitError, setSubmitError] = useState<string | null>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const {
            register,
            handleSubmit,
            formState: { errors, isValid },
        } = useForm<PasswordForgotFormData>({
            mode: 'onChange',
            defaultValues: { email: '' },
        });

        const submitFormHandler = async ({ email }: PasswordForgotFormData) => {
            try {
                setSubmitError(null);
                setIsSubmitting(true);
                await requestPasswordForgot({ email });
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

                    {submitError && <ErrorMessage error={submitError} />}

                    <Button
                        type="submit"
                        className="auth-form__button"
                        aria-label={t('common:form.button.send')}
                        disabled={
                            !PASSWORD_AUTH_ENABLED || !isValid || isSubmitting
                        }
                    >
                        {isSubmitting
                            ? t('common:loading')
                            : t('common:form.button.send')}
                    </Button>
                </FieldGroup>
            </form>
        );
    },
);

PasswordForgotForm.displayName = 'PasswordForgotForm';
