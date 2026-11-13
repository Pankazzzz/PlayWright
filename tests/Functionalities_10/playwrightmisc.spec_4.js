const { chromium } = require('playwright');
const assert = require('assert');

//assert
(async () => {


    const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
    timeout: 60000,
    args: ['--start-maximized']
    });


    const context = await browser.newContext({
    viewport: {
        width: 1920,
        height: 1080
    },
    locale: 'en-US',
    timezoneId: 'Asia/Kolkata',
    colorScheme: 'dark',
    permissions: ['geolocation'],
    geolocation: {
        latitude: 19.0760,
        longitude: 72.8777
    },
    ...devices['iPhone 13']
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://example.com');
    const title = await page.title();

    assert.strictEqual(title, 'Example Domain');

    await context.close();
    await browser.close();


    //testing 2 locations
    const browser = await chromium.launch();

    const indiaContext = await browser.newContext({
        locale: 'en-IN',
        timezoneId: 'Asia/Kolkata'
    });

    const usContext = await browser.newContext({
        locale: 'en-US',
        timezoneId: 'America/New_York'
    });

    const indiaPage = await indiaContext.newPage();
    const usPage = await usContext.newPage();

    await indiaPage.goto('https://example.com');
    await usPage.goto('https://example.com');
    await indiaContext.close();
    await usContext.close();
    await browser.close();

})();


//Worker Scope
import { test as base } from '@playwright/test';

const test = base.extend({

    workerData: [

        async ({}, use) => {

            console.log('Worker setup');
            await use({ name: 'Worker Resource' });
            console.log('Worker teardown');

        },

        { scope: 'worker' }

    ]

});

test('Test 1', async ({ workerData }) => {

    console.log(workerData.name);

});

test('Test 2', async ({ workerData }) => {

    console.log(workerData.name);

});