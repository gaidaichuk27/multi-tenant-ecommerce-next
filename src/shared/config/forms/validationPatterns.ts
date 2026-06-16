export const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const PASSWORD_PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const NAME_PATTERN =
    /^([a-zA-Z]{2,}(?:\s[a-zA-Z]{1,}(?:['-][a-zA-Z]{2,})?\s?([a-zA-Z]{1,})?)?)$/;
