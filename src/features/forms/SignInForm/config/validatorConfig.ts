import type { ValidatorConfig } from '@hooks/useForm/types';
import {
    RegexValidator,
    RequiredValidator,
    MinLengthValidator,
    HasCapitalizeValidator,
    HasNumberValidator,
    HasLowerCaseValidator,
} from '@hooks/useForm';
import type { SignInFormData } from '../model/types/types';
import { TFunction } from 'i18next';

export const initialState: SignInFormData = {
    email: '',
    password: '',
};

export const validatorConfig = (
    t: TFunction,
): ValidatorConfig<SignInFormData> => ({
    email: [
        new RequiredValidator({
            message: `${t('form.validation.required', { field: t('form.placeholder.email') })}`,
        }),
        new RegexValidator({
            message: `${t('form.validation.email', { field: t('form.placeholder.email') })}`,
            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        }),
    ],
    password: [
        new RequiredValidator({
            message: `${t('form.validation.required', { field: t('form.placeholder.password') })}`,
        }),
        new MinLengthValidator({
            message: `${t('form.validation.min.length', { field: t('form.placeholder.password'), length: 8 })}`,
            value: 8,
        }),
        new HasCapitalizeValidator({
            message: `${t('form.validation.one.capital.letter', { field: t('form.placeholder.password') })}`,
        }),
        new HasLowerCaseValidator({
            message: `${t('form.validation.one.lowercase.letter', { field: t('form.placeholder.password') })}`,
        }),
        new HasNumberValidator({
            message: `${t('form.validation.one.number', { field: t('form.placeholder.password.repeat') })}`,
        }),
    ],
});
