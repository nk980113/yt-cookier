export const noop: () => void;
// TODO: Add JSDoc
export interface Callbacks {
  debug: (data: string) => unknown;
	error: (error: string) => unknown;
}
export interface CallbacksAndCookies extends Callbacks {
	loginCookies: object[];
}