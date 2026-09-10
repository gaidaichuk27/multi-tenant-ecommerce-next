'use client';

import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { LogInIcon } from 'lucide-react';

import { PasswordForgotFormData } from '../../model/types/types';
import { requestPasswordForgot } from '@lib/auth/password-client-api';
import { AUTH_T_MESSAGES } from '@repo/api';
import { useFormApiError } from '@shared/hooks/useFormApiError';
import { Button } from '@shared/ui/Form/Button';
import { cn } from '@lib/utils';
import { Field, FieldGroup, FieldLabel } from '@shared/ui/Form/Field';
import { ErrorMessage } from '@shared/ui/Form/ErrorMessage';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@shared/ui/Form';
import { EMAIL_VALIDATION } from '@shared/config/forms/fieldValidation';
import type { Language } from '@shared/config/locales/types';

interface PasswordForgotFormProps {
    className?: string;
    locale: Language;
}

export const PasswordForgotForm = memo(
    ({ className, locale }: PasswordForgotFormProps) => {
        const { t } = useTranslation(['common']);
        const getSubmitError = useFormApiError();
        const [submitError, setSubmitError] = useState<string | null>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const {
            register,
            handleSubmit,
            reset,
            clearErrors,
            formState: { errors, isValid },
        } = useForm<PasswordForgotFormData>({
            mode: 'onChange',
            defaultValues: { email: '' },
        });

        const submitFormHandler = async (data: PasswordForgotFormData) => {
            try {
                setIsSubmitting(true);
                await requestPasswordForgot({
                    email: data.email,
                    locale,
                });
                setSubmitError(null);
                clearErrors();
                toast.success(
                    t(`common:${AUTH_T_MESSAGES.PASSWORD_FORGOT_SUCCESS}`),
                );
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
                        disabled={!isValid || isSubmitting}
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
