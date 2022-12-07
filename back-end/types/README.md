## Declaration merging, module augmentation
#### >>> https://www.typescriptlang.org/docs/handbook/declaration-merging.html

Declaration merging mechanically joins the members of both declarations into a single interface (it's not limited to interface) with the same name.

Example :
```ts
interface A {
	abc: string;
	def: string;
}

interface A {
	ghi: boolean;
	jkl: Array<string>;
}
```

Result :
```ts
interface A {
	abc: string;
	def: string;
	ghi: boolean;
	jkl: Array<string>;
}
```

It's often used to extends a library interface, like Request from express.
Say we want to store something in the Request, let's say `req.user`, where `req: Request`
Typescript does not know about the property `user` because it does not exist inside the Express library, and it cause a typeError.
So what we do is manually declare the merge of the property user to the Request interface.

```ts
declare namespace Express {
	export interface Request {
		user: User;
	}
}
```

Now `req.user` is typed with the interface `User` whenever we have acces to `Request` from `express`