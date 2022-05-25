// @ts-check
const puppeteer = require("puppeteer-extra");
const dataRef = require("../dataRef");
const { noop } = require("../utils");

/** Gets request headers from a certain video.
 * @param {string} url Video URL.
 * @param {import("../utils").CallbacksAndCookies} callbacksAndCookies Optional callbacks for checking progress and default cookies.
 * @returns {Promise<object>} The request headers.
 */
module.exports = function getHeaders(url, {
  debug = noop,
  error = noop,
  loginCookies = [],
} = {}) {
  debug("Attempting to get headers");
  const StealthPlugin = require("puppeteer-extra-plugin-stealth");
  let returnValue = null;

  puppeteer.use(StealthPlugin());

  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: false,
      timeout: 0
    });
    const pages = await browser.pages();
    const page = await pages[0];
    const navigationPromise = page.waitForNavigation();

    try {
      const cookies = (dataRef.loginCookies.length && dataRef.loginCookies) || loginCookies;
      if (!cookies) {
        reject("Login cookies not found! Please use login() to fetch login cookies or pass cookies as a parameter.");
        return; // Promise that the Promise won't run more
      }
      await page.setCookie(...cookies);

      // Opening YouTube.com
      await page.goto(url);

      await page.on("request", async request => {
        const requestHeaders = request.headers(); //getting headers of your request
        // console.log(requestHeaders)
        const headers = JSON.stringify(requestHeaders);
        if (headers.includes("x-youtube-identity-token")) {
          dataRef.headers = returnValue = requestHeaders;
          dataRef.loginCookies = await page.cookies(); // Update login
          await browser.close();
          resolve(returnValue);
        }
        // await browser.close();
      });
    } catch (e) {
      error(e.message);
    } finally {
      // await browser.close();
    }
    // await browser.close();
  });
};