const puppeteer = require("puppeteer-extra");

const fs = require("fs");

module.exports = function getHeaders(url) {
  console.log("Attempting to get headers");
  const StealthPlugin = require("puppeteer-extra-plugin-stealth");
  let returnValue = null;

  puppeteer.use(StealthPlugin());

  return new Promise(async (resolve) => {
    const browser = await puppeteer.launch({
      headless: false,
      timeout: 0
    });
    const pages = await browser.pages();
    const page = await pages[0];
    const navigationPromise = page.waitForNavigation();

    try {
      const cookiesString = fs.readFileSync("./node_modules/ytcf/LoginCookies.json");
      const cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);

      // Opening YouTube.com
      await page.goto(url);

      await page.on("request", async request => {
        const requestHeaders = request.headers(); //getting headers of your request
        // console.log(requestHeaders)
        const headers = JSON.stringify(requestHeaders);
        if (headers.includes("x-youtube-identity-token")) {
          returnValue = requestHeaders;
          fs.writeFileSync("./node_modules/ytcf/headers.json", JSON.stringify(requestHeaders, null, 4)),
          function (err, res) {
            if (err) throw err;
          };
          const LoginCookies = await page.cookies();
          fs.writeFileSync("./node_modules/ytcf/LoginCookies.json", JSON.stringify(LoginCookies, null, 2)), //Update Login
          function (err) {
            if (err) throw err;
          };
          await browser.close();
          resolve(returnValue);
        }
        // await browser.close();
      });
    } catch (e) {
      throw new Error(e);
    } finally {
      // await browser.close();
    }
    // await browser.close();
  });
};