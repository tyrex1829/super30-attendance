import puppeteer from "puppeteer";
import axios from "axios";

async function loginToRouter() {
  const browser = await puppeteer.launch({ headless: false }); // Launch browser in non-headless mode
  const page = await browser.newPage();

  try {
    // Open the login page
    await page.goto("http://192.168.0.1/webpages/index.html?t=9d249c89", {
      waitUntil: "networkidle0",
    });

    // Wait for the password input to load and enter the password
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await page.type('input[type="password"]', "@tyreX");

    // Wait for and click the login button
    await page.waitForSelector('a.button-button[title="LOG IN"]', {
      timeout: 5000,
    });
    await page.click('a.button-button[title="LOG IN"]');

    // Wait for navigation to complete
    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });

    // Log the new URL to verify login success
    const newURL = page.url();
    console.log("Current URL after login:", newURL);

    // Introduce a manual delay to keep the browser open for inspection
    const localStorageData = await page.evaluate(() => {
      // Access and return localStorage items
      return {
        encryptorAES: localStorage.getItem("encryptorAES"),
      }; // Replace 'yourKeyName' with the actual key you're looking for
    });

    console.log("LocalStorage data:", localStorageData);

    await axios.post("http://localhost:3000/store-local-storage", {
      data: localStorageData, // Send the localStorage data to your server
    });

    console.log("Data sent to the server successfully!");
  } catch (error) {
    console.log("Error during login:", error.message);
  } finally {
  }
}

// Run the login function
loginToRouter();
