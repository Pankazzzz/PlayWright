const { test, expect } = require('@playwright/test');

//test.describe.configure({mode:'parallel'});
//test.describe.configure({mode:'serial'});

test('@web Pratice Test', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    //************************ Pre start ************************
    page.title();
    page.url();
    expect(page).toHaveTitle("");
    expect(page).toHaveURL("");
    await page.goBack();
    await page.goForward();
    await page.goBack();

    //************************ Locator methods ************************
    const username = page.locator("#username");
    page.locator("#signInBtn");
    page.locator("").fill("");
    page.locator("").pressSequentially("");
    page.locator("").click();
    page.locator("").clear();
    page.locator("").check();
    page.locator("").uncheck();
    page.locator("").hover();
    const textcont = page.locator("").textContent();
    const Alltextcont = page.locator("").allTextContents();

    page.locator("").first().click();
    page.locator("").last().click();
    page.locator("").nth(5).click();

    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    await page.locator("text=Checkout").click();

    //uniqueLocator
    page.getByPlaceholder("email@example.com").fill(email)
    page.getByRole('button', { name: "Login" }).click();
    page.locator(".card-body").filter({ hasText: "ZARA COAT 3" }).getByRole("button", { name: "Add to Cart" }).click();
    page.getByRole("listitem").getByRole('button', { name: "Cart" }).click();
    page.getByText("PLACE ORDER").click();
    page.getByLabel("").click(); //efficent for radio,checbox,dropdown.
    page.getByLabel("").selectOption();



    //************************ Dropdown ************************
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult"); //here we put value

    //first parameter is select tag locator
    await page.selectOption('#multiSelectDropdown', ['apple', 'banana']); //select multiple option
    await page.selectOption('#fruits', { label: 'Banana' });
    await page.selectOption('#fruits', { index: 1 });
    await page.selectOption('#fruits', { value: 'apple' });

    //************************ Utilities ************************
    page.waitForLoadState("networkidle");

    //************************ Wait ************************
    page.locator("").first().waitFor(); //this works for one element only

    //************************ Expect ************************
    expect(page.locator("[style*='block']")).toContainText("Incorrect");
    expect(page.locator("[style*='block']")).toBeChecked();
    expect(page.locator("")).toHaveAttribute('class', 'blinkingText');

    expect(page.locator("[style*='block']").isChecked()).toBeTruthy();
    expect(page.locator("[style*='block']").isDisabled).toBeFalsy();
    expect(page.locator("[style*='block']").isEditable()).toBeFalsy();
    expect(page.locator("[style*='block']").isEnabled()).toBeFalsy();
    expect(page.locator("[style*='block']").isHidden()).toBeFalsy();
    expect(page.locator("[style*='block']").isVisible()).toBeFalsy();
    expect(page.getByText("Thankyou for the order.")).toBeVisible();
    expect(page.locator("#displayed-text")).toBeHidden();


    const aexp = 'hello';
    const bexp = 'he';
    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    expect(aexp.includes(bexp)).toBeTruthy();


    //************************ Api ************************
    page.route('**/*.{jpg,png,jpeg}', route => route.abort()); //**/* means any link
    page.on('request', request => console.log(request.url())); //on means whenever request event occurs
    page.on('response', response => console.log(response.url(), response.status())); //on means whenever request event occurs


    //************************ Child window ************************
    const documentLink = page.locator("[href*='documents']");
    const [newPage1, newpage2] = await Promise.all([
        context.waitForEvent('page'),  //event should be before action
        documentLink.click()
    ]);
    const text = await newPage.locator(".red").textContent();


    //************************ Hierarchy ************************
    const products = page.locator(".card-body");
    const count = await products.count();
    for (let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    //************************ Frame ************************
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator("li a[href='lifetime-access']:visible").click();
    const pageContent = await framePage.locator(".text h2").textContent();

    //************************ Alert ************************
    page.once('dialog', dialog => dialog.accept()); ////if u use on then u can handle only 1 dialog

    await page.once('dialog', async dialog => {
        console.log('Dialog message:', dialog.message());
        await dialog.dismiss(); // or dialog.accept();
    });

    page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept('Playwright user'); // Enters text and clicks OK
    });

    await page.click('#promptButton');

    //once is for handling only 1 dialog, whereas on can handle multiple dialogs throughout page.




    //************************Screenshot & Visual Testing************************
    test("Screenshot & Visual comparision", async ({ page }) => {
        await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
        await expect(page.locator("#displayed-text")).toBeVisible();
        await page.locator('#displayed-text').screenshot({ path: './snapshots/partialScreenshot.png' }); //element level screenshot
        await page.locator("#hide-textbox").click();
        await page.screenshot({ path: './snapshots/screenshot.png' }); //page levelscreenshot
        await expect(page.locator("#displayed-text")).toBeHidden();
    });

    //screenshot -store -> screenshot -> 
    test('visual', async ({ page }) => {
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        expect(await page.screenshot()).toMatchSnapshot('landing.png'); //compare screenshot in snapshot folder
    })






    //await page.pause();

});


test.skip('Pratice Test 2', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});

test.once('Pratice Test 3', async function ({ page }) {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});

test.skip("Calendar validations", async ({ page }) => {

    const monthNumber = "6";
    const date = "15";
    const year = "2027";
    const expectedList = [monthNumber, date, year];
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber) - 1).click();
    await page.locator("//abbr[text()='" + date + "']").click();
    const inputs = await page.locator(".react-date-picker__inputGroup input");
    for (let index = 0; index < inputs.length; index++) {
        const value = inputs[index].getAttribute("value");
        expect(value).toEqual(expectedList[index]);
    }
})
