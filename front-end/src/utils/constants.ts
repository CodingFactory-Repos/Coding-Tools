const FORMAT_EMAIL_RECIPIENT = "^_?(?=.{2,42}@)[0-9a-zA-Z]+(?:[_.-][0-9a-z]+)*"
const FORMAT_EMAIL_DOMAIN = "((?=.{3,64}$)[a-z0-9]+(?:-{1,3}[a-z]+)?(?:\\.[a-z]{0})?)+(?:[a-z]+\\.[a-z]{2,})+$";
export const FORMAT_EMAIL = new RegExp(`${FORMAT_EMAIL_RECIPIENT}@${FORMAT_EMAIL_DOMAIN}`);
export const FORMAT_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-\/:;<=>?@[\\\]^_`{|}~\.])[A-Za-z\d!"#$%&'()*+,\-\/:;<=>?@[\\\]^_`{|}~\.]{8,}$/;