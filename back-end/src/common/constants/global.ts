const FORMAT_EMAIL_RECIPIENT = "^_?(?=.{2,42}@)[0-9a-zA-Z]+(?:[_.-][0-9a-z]+)*" as const;
const FORMAT_EMAIL_DOMAIN = "((?=.{3,64}$)[a-z0-9]+(?:-{1,3}[a-z]+)?(?:\\.[a-z]{0})?)+(?:[a-z]+\\.[a-z]{2,})+$" as const;
export const EMAIL_FORMAT = new RegExp(`${FORMAT_EMAIL_RECIPIENT}@${FORMAT_EMAIL_DOMAIN}`);

const AT_LEAST_ONE_LETTER = "(?=.*[A-Za-z])" as const;
const AT_LEAST_ONE_DIGIT = "(?=.*\\d)" as const;
const AT_LEAST_ONE_SPECIAL_CHAR = "(?=.*[!\"#$%&'()*+,\\-\\/:;<=>?@[\\\\\\]^_\`{|}~\\.])" as const;
const ALLOWED_CHAR = "[A-Za-z\\d!\"#$%&'()*+,\\-\\/:;<=>?@[\\\\\\]^_\`{|}~\\.]{8,}" as const;
export const PASSWORD_FORMAT = new RegExp(`^${AT_LEAST_ONE_LETTER}${AT_LEAST_ONE_DIGIT}${AT_LEAST_ONE_SPECIAL_CHAR}${ALLOWED_CHAR}$`);