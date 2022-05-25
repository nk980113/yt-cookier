// Use reference to save data
// @ts-check
module.exports = {
  /** Cookies from login page.
   * @type {object[]}
   * @example
   * ```js
   * const { login, dataRef } = require("ytcf");
   * await login({
   *   email: "email@example.com",
   *   pass: "password",
   * });
   * const { loginCookies } = dataRef;
   * ```
   */
  loginCookies: [],

  /** Request headers from given YouTube page.
   * @type {object}
   * @example
   * ```js
   * const { login, getHeaders, dataRef } = require("ytcf");
   * const assert = require("assert");
   * await login({
   *   email: "email@example.com",
   *   pass: "password",
   * });
   * const requestHeaders = await getHeaders("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
   * assert.equal(requestHeaders, dataRef.headers);
   * ```
   */
  headers: {},
};