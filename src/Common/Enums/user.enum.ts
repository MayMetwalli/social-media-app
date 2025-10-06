enum RoleEnum {
    USER = 'user',
    ADMIN = 'admin'
}

enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female'
}

enum ProviderEnum {
    GOOGLE = 'google',
    LOCAL = 'local'
}



enum OtpTypesEnum{
    CONFIRMATION = 'confirmation',
    RESET_PASSWORD = 'reset-password',
    PASSWORD_RESET = "PASSWORD_RESET",
    TWO_FACTOR = "TWO_FACTOR"
}

export {RoleEnum, GenderEnum, ProviderEnum, OtpTypesEnum}