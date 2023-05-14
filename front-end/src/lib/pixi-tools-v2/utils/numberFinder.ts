export const lowestNumberFinder = (n: Array<number>) => {
	return [...new Set(n)].reduce((acc, cur) => (cur === acc ? acc + 1 : cur > acc ? acc : cur), 1);
};
