const FORMAT_EMAIL_RECIPIENT = '^_?(?=.{2,42}@)[0-9a-zA-Z]+(?:[_.-][0-9a-z]+)*';
const FORMAT_EMAIL_DOMAIN =
	'((?=.{3,64}$)[a-z0-9]+(?:-{1,3}[a-z]+)?(?:\\.[a-z]{0})?)+(?:[a-z]+\\.[a-z]{2,})+$';
export const FORMAT_EMAIL = new RegExp(`${FORMAT_EMAIL_RECIPIENT}@${FORMAT_EMAIL_DOMAIN}`);

const AT_LEAST_ONE_LETTER = '(?=.*[A-Za-z])';
const AT_LEAST_ONE_DIGIT = '(?=.*\\d)';
const AT_LEAST_ONE_SPECIAL_CHAR = '(?=.*[!"#$%&\'()*+,\\-\\/:;<=>?@[\\\\\\]^_`{|}~\\.])';
const ALLOWED_CHAR = '[A-Za-z\\d!"#$%&\'()*+,\\-\\/:;<=>?@[\\\\\\]^_`{|}~\\.]{8,}';
export const FORMAT_PASSWORD = new RegExp(
	`^${AT_LEAST_ONE_LETTER}${AT_LEAST_ONE_DIGIT}${AT_LEAST_ONE_SPECIAL_CHAR}${ALLOWED_CHAR}$`,
);

export const CAMPUS_LIST = [
	"Paris",
	"Cergy",
	"Pontoise",
] as const;

export const DISCIPLINES_LIST = [
	"Python",
	"Typescript",
	"Rust",
	"Javascript",
	"Java",
	"Git",
	"HTML",
	"CSS",
	"React",
	"Node.js",
	"SQL",
	"PHP",
	"C",
	"C++",
	"C#",
	"Carbon",
	"Ruby",
	"Swift",
	"Objective-C",
	"Kotlin",
	"Scala",
	"Go",
	"Perl",
	"Lua",
	"Haskell",
	"Clojure",
	"Assembly",
	"Web3",
	"F#",
	"R",
	"MATLAB",
	"Julia",
	"Dart",
	"Flutter",
	"Android",
	"iOS",
	"AWS",
	"Azure",
	"Google Cloud",
	"Firebase",
	"MongoDB",
	"Redis",
	"GraphQL",
	"Apollo",
	"Postgre",
	"Next.js",
	"Nuxt.js",
	"Gatsby",
	"Webpack",
	"Babel",
	"Jest",
	"Mocha",
	"Chai",
	"Enzyme",
	"Puppeteer",
	"Blender",
	"Three.js",
	".NET",
	"Unity",
	"Unreal Engine",
	"OpenGL",
	"DirectX",
	"OpenCV",
	"TensorFlow",
	"PyTorch",
	"Keras",
	"Scikit-learn",
	"Django",
	"Flask",
	"Ruby on Rails",
	"Express.js",
	"Socket.io",
	"OAuth",
	"JWT",
	"OAuth2",
	"Docker",
	"Kubernetes",
	"Jenkins",
	"CircleCI",
	"CI/CD"
] as const;