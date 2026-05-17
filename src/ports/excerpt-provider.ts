export interface IExcerptProvider {
	getExcerpt(path: string, maxChars: number): Promise<string>;
}
