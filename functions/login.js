// @ts-check
const puppeteer = require("puppeteer-extra");
const dataRef = require('../dataRef');

module.exports = async function login({ email, pass }, { debug, error }) {
  const StealthPlugin = require("puppeteer-extra-plugin-stealth");
  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({
    timeout: 0
  });

  try {
    const page = await browser.newPage();

    // Opening the sign in page
    await page.goto("https://accounts.google.com/signin/v2/identifier" +
			"?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den-US%26next%3D%252F" +
			"&hl=zh-HK" +
			"&passive=false" +
			"&service=youtube" +
			"&uilel=0t" +
			"&flowName=GlifWebSignIn" +
			"&flowEntry=AddSession");

    await page.waitForNavigation();

    // Find email box
    const select = await page.waitForSelector("input[type=\"email\"]");

    if (!select) {
      error("Email box not found!");
      return;
    }

    // Fill in the email address
    await select.click();
    await page.type("input[type=\"email\"]", email);

    // Press continue button
    await page.waitForSelector("#identifierNext");
    await page.click("#identifierNext");

    // Fill in the password
    await page.waitForSelector("input[type=\"password\"]");
    await page.waitForSelector("input[type=\"password\"]", {
      visible: true
    });

    await page.type("input[type=\"password\"]", pass);

    // Continue
    await page.keyboard.press("Enter");

    // Check tab title
    console.log("Checking login status...");

    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });

    const uri = page.url();
    if (uri.includes("accounts.google.com/signin") && !uri.includes("admin.google.com/a/cpanel")) {
      error("Your password is wrong or 2FA on this account is enabled! Please check and try again.");
      return;
    }

    if (uri.includes("admin.google.com/a/cpanel")) {
      error("This account have no right to access youtube.com! Please try another account!");
      return;
    }

    if (uri.startsWith("https://www.youtube.com/")) {
      debug("Successfully logged in!\nSuccessfully verified your account!");
      const cookies = await page.cookies();
      dataRef.loginCookies = cookies;
    } else {
      process.emitWarning("An unexpected error occurred!\nPleace check the popped out window to check whats wrong and post an issue to:\nhttps://github.com/ItzMiracleOwO/yt-cookier/issues");
      error("Closing the browser with the status FAILED");
    }

  } finally {
    await browser.close();
  }
};