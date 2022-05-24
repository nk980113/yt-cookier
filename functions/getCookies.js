// @ts-check
const puppeteer = require("puppeteer-extra");
const dataRef = require("../dataRef");
const fs = require("fs");

module.exports = async function getCookie(url, { debug, error, loginCookies }) {

  debug("Attempting to get cookies");

  const StealthPlugin = require("puppeteer-extra-plugin-stealth");
  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({
    headless: false
  });
  const pages = await browser.pages();
  const page = await pages[0];
  const navigationPromise = page.waitForNavigation();

  try {
    const cookies = dataRef.loginCookies ?? loginCookies;
    if (!cookies) {
      error("Login cookies not found! Please use login() to fetch login cookies or pass cookies as a parameter.");
      return;
    }
    await page.setCookie(...cookies);

    // Opening YouTube.com
    await page.goto(url);
    await navigationPromise;

    const PageCookies = await page.cookies();
    const cookieStr = JSON.stringify(PageCookies, null, 4);

    dataRef.loginCookies = PageCookies; // Update login

    await browser.close();

    // const cookieString = fs.readFileSync("./node_modules/ytcf/cookies.json");
    const Rcookies = PageCookies.map(({
      name,
      value
    }) =>
      `${name}=${value}`).join("; ");

    return Rcookies;

  } catch (e) {
    error(e);
  } finally {
    // await browser.close();
  }
};