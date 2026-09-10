import { changePasswordController } from './changePassword.controller';
import { forgotPasswordController } from './forgotPassword.controller';
import { loginController } from './login.controller';
import { meController } from './me.controller';
import { registerController } from './register.controller';
import { resendVerificationController } from './resendVerification.controller';
import { restorePasswordController } from './restorePassword.controller';
import { verifyEmailController } from './verifyEmail.controller';

export const controllers = {
    postRegister: registerController,
    postLogin: loginController,
    getMe: meController,
    getVerifyEmail: verifyEmailController,
    postResendVerification: resendVerificationController,
    postForgotPassword: forgotPasswordController,
    postRestorePassword: restorePasswordController,
    postChangePassword: changePasswordController,
};
