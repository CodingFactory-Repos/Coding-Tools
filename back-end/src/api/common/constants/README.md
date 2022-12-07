## Constants

- Scope : Global
- CAPITAL CASE OBLIGE
- snake_case oblige
- Keep it immutable
- Array, object, regex, ...

## Example

```ts
export const EMAIL_VALIDATOR = /regex/; // Used to validate a string somewhere
export const MIME_TYPES = ["image/jpg", "image/gif", "image/png", ...]; // Array of possibilites, used for sorting/validation/assignment
export const STATUS = ["ongoing", "done", "canceled", ...] // Array of possibilites, used for sorting/validation/assignment

// Fontend like
export const PRIMARY_COLOR = "hex";
export const SECONDARY_COLOR = "hex";

// Note : It is also possible to replace MIME_TYPES and STATUS by what we call enumerator.
// >>>>> https://www.typescriptlang.org/docs/handbook/enums.html
```
