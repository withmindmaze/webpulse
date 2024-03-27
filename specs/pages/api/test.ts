// specs/pages/api/[...params].specs.ts

import puppeteer from 'puppeteer';

describe('API /api/[...params] Integration Test', () => {
  //@ts-ignore
  let browser: puppeteer.Browser;
  //@ts-ignore
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should return 200 and a lighthouse report for valid URL', async () => {
    const url = 'http://localhost:3000/api/audit';
    const postData = { url: 'https://google.com' };

    const result = await page.evaluate((url: any, data: any) => {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json().then(json => ({
          status: response.status,
          json
        })));
    }, url, postData);

    console.log(`Response status: ${result.status}`);
    expect(result.status).toBe(200);
    expect(result.json).toBeDefined();

    // Check if categories.accessibility.score exists in the JSON response
    const accessibilityScore = result.json.categories?.accessibility?.score;
    console.log(`Accessibility Score: ${accessibilityScore}`);
    expect(accessibilityScore).toBeDefined();
    // You can also add more specific checks, like expecting a particular score range
  }, 20000);

  test('should return 500 in case of invalid URL', async () => {
    const url = 'http://localhost:3000/api/audit';
    const postData = { url: 'www.google.com' };

    const response = await page.evaluate((url: any, data: any) => {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(res => res.status);
    }, url, postData);

    console.log(`Response status: ${response}`);
    expect(response).toBe(500);
  }, 20000);
});
