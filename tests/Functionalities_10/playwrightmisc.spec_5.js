test.skip('Pratice Test 3', async function ({ page }) {

    //download
    const [download] = await Promise.all([
    page.waitForEvent('download'), 
    page.locator("button[class*='no_print']:first-of-type").first().click()
    ]);
    await download.saveAs('/Users/pankajshukla/Downloads/invoice.pdf');
    const path = await download.path();


    await page.getByText("Back to Home",{exact:true}).click();
    await page.getByRole('button', { name: /^Download as PDF$/ }).scrollIntoViewIfNeeded();
    await bookingW.first().waitFor({state:'visible'});
    await page.locator(".form-floating").filter({has : page.locator("#t-passport-1")}).locator("input").fill("1234567AJSH")
    await page.getByRole('option', { name: /^India$/ }).first().scrollIntoViewIfNeeded();
 


        await expect(pageTitle).toContain(data.pageTitle);

        const fullAddress = addressList.join(' ').toLowerCase();
        await expect(confirmationMessage).toEqual("Congratulations! Your order has been confirmed!");

        //await page.locator('selector').scrollIntoViewIfNeeded();
        //await page.locator('selector').evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        //await page.evaluate(() => window.scrollBy(0, 500)); // Scrolls down 500px

    
        //New
        await page.locator("").waitFor({ state: 'attached', timeout: 5000 });
        await page.locator("").waitFor({ state: 'detached', timeout: 10000 });
        await page.locator("").waitFor({ state: 'visible', timeout: 15000 });
        await page.locator("").waitFor({ state: 'hidden', timeout: 20000 });


        await page.getByAltText('User Profile').click(); ///this is for image

        <button title="Delete User">
        <svg></svg>
        </button>
        
        await page.getByTitle('Delete User').click();


        //Locator chaining means combining multiple locators to identify an element inside a particular parent or DOM section.
            // <div class="user-card">
            //     <h2>John Smith</h2>
            //     <button>Edit</button>
            // </div>

            // <div class="user-card">
            //     <h2>David Miller</h2>
            //     <button>Edit</button>
            // </div>

        //This can cause a strict mode violation.

        const johnCard = page.locator('.user-card')
        .filter({
            hasText: 'John Smith'
        });

        await johnCard.getByRole('button', {
            name: 'Edit'
        }).click();


        await page
        .locator('.user-container')
        .locator('.user-card')
        .getByRole('button', { name: 'Edit' })
        .first()
        .click();

        const user = page.locator('.user-card')
        .filter({
            hasText: 'John Smith'
        })
        .filter({
            has: page.getByRole('button', {
                name: 'Edit'
            })
        });


    //You have 100 employee rows. Each row has an Edit button. You need to edit employee Pankaj. How would you do it?
        const employeeRow = page.locator('tr')
            .filter({
                hasText: 'Pankaj'
            });

        await employeeRow.getByRole('button', {
            name: 'Edit'
        }).click();


        //has and hasNot
        const users = page.locator('.user')
            .filter({
                hasNotText: 'Inactive'
            });

        const products = page.locator('.product')
        .filter({
            hasNot: page.getByRole('button', {
                name: 'Add to Cart'
            })
        });


        //and
        <button class="primary" type="submit">
        Login
        </button>

        const loginButton = page
        .getByRole('button', { name: 'Login' })
        .and(
            page.locator('button.primary')
        );
        await loginButton.click();

        //or
        const welcomeDialog = page.getByText('Welcome Back');
        const securityDialog = page.getByText('Verify Your Identity');
        const dialog = welcomeDialog.or(securityDialog);
        await expect(dialog.first()).toBeVisible();


        <div id="employee">
        <h2>Pankaj Shukla</h2>
        <button>View Profile</button>
        </div>

        const employee = page.locator('#employee');
        const button = employee.locator('button');
        await button.click();

        const employeeName = page.locator('#employee')
        .locator('h2');

        const button = page.locator('#employee button');


        //9.4 When should you use XPath?
        // Use XPath when:
        // - You need to navigate complex parent-child relationships.
        // - You need sibling or ancestor navigation.
        // - The application has no stable attributes.
        // - Existing framework conventions rely on XPath.
        // Avoid:
        // - Absolute XPath.
        // - Long DOM-dependent expressions.
        // - Index-heavy expressions.
        // - XPath that breaks whenever the UI structure changes.

        //css
        page.locator('.user-card > button'); //direct child
        page.locator('label + input'); //adjacent sibling
        page.locator('label ~ input'); //general sibling


        page.locator('li:first-child');
        page.locator('li:last-child');
        page.locator('li:nth-child(2)');
        page.locator('input:checked');
        page.locator('input:disabled');
        page.locator('button:not(.disabled)');

        page.locator('div:has(button)');
        page.locator('div:has-text("John")');
        page.locator('input:visible');


        // Playwright normalizes whitespace when matching text. It generally:
        // Collapses multiple spaces into one.
        // Converts line breaks into spaces.
        // Removes leading and trailing whitespace.
        // Therefore, this can work:
        // page.getByText('Login to Application', {
        //     exact: true
        // });


        //12.1 Important regex patterns
        // Pattern	Meaning
        // /Login/	Contains Login
        // /^Login/	Starts with Login
        // /Login$/	Ends with Login
        // /^Login$/	Exactly Login
        // /login/i	Case-insensitive
        // /\d+/	One or more digits
        // /[A-Z]+/	One or more uppercase letters
        // /ORD-\d+/	Order ID followed by digits


        //12.2 Dynamic button example
        // Suppose buttons have these names:
        // Delete User 101
        // Delete User 102
        // Delete User 103

        // Use:
        // const deleteButton = page.getByRole('button', {
        //     name: /^Delete User \d+$/
        // });


        //     What is all()?
        // all() returns an array of locators for all elements currently matching the locator.

        // Example:
        // <ul>
        //     <li>Apple</li>
        //     <li>Banana</li>
        //     <li>Orange</li>
        // </ul>


        // Playwright:
        // const items = await page.locator('li').all();
        // console.log(items.length);


        // It immediately returns whatever matches at that moment.
        // Suppose a React application loads 10 rows asynchronously.

        // If you call:
        // const rows = await page.locator('tr').all();

        // before loading finishes, you may get an incomplete list.
        // Better:
        // const rows = page.locator('tr');
        // await expect(rows).toHaveCount(10);
        // const allRows = await rows.all();
        // This ensures the list has reached the expected size before retrieving it.


        const texts = await page.locator('li').allInnerTexts();
        [
            'Apple',
            'Banana',
            'Orange'
        ]



        userCard.getByRole('heading', {
            name: 'John Smith'
        });

        userCard.getByRole('button', {
            name: 'Edit'
        });

        userCard.getByRole('link', {
            name: 'View Profile'
        });


        //evaluate
        const text = await page.locator('#username').evaluate(
            element => element.getAttribute('placeholder')
        );
        console.log(text);

        const tagName = await page.locator('#login').evaluate(
            element => element.tagName
        );
        console.log(tagName);


        //evaluateAll
        const values = await page.locator('li').evaluateAll(
            elements => elements.map(element => element.textContent.trim())
        );
        console.log(values);


        //LoadingIndicator
        await page.locator('.spinner').waitFor({
            state: 'hidden'
        });

        await expect(page.getByRole('heading', {
            name: 'Dashboard'
        })).toBeVisible();


        //svg
        page.locator('svg[data-testid="delete-icon"]');


        //tap
        const context = await browser.newContext({
            viewport: { width: 390, height: 844 },
            isMobile: true,
            hasTouch: true
        });

        const page = await context.newPage();
        const loginButton = page.getByRole('button', { name: 'Login' });
        await loginButton.tap();


        //focus & blur
        const username = page.getByLabel('Username');
        await username.focus();
        await expect(username).toBeFocused();

        //blur
        await username.blur();

        //checkboxes & radiobutton
        //Why use setChecked() instead of click()?
        //It ensures the element reaches the requested checked state. If it is already checked, setChecked(true) does not unnecessarily toggle it off.
        const checkbox = page.getByLabel('Accept Terms');
        checkbox.check();
        checkbox.uncheck();
        await checkbox.setChecked(true);
        await checkbox.setChecked(false);
        await expect(checkbox).toBeChecked(); //verify


        //SelectText()
        const input = page.getByLabel('Username');
        await input.fill('PankajShukla');
        await input.selectText();


        //scrollIntoView
        const submitButton = page.getByRole('button', {
            name: 'Submit'
        });
        await submitButton.scrollIntoViewIfNeeded();
        await submitButton.click();

        //boundingbox - returns dimension
        const box = await page.locator('#login').boundingBox();

        //inputValue
        const email = await page.getByLabel('Email').inputValue();

        //getAttribute
        const placeholder = await page.locator('#email').getAttribute('placeholder');

        //ElementState
        await expect(submitButton).toBeEnabled();
        await expect(submitButton).toBeDisabled();
        await expect(page.getByText('Welcome')).toBeVisible();
        await expect(page.getByText('Loading')).toBeHidden();
        await expect(page.getByText('Loading')).toBeEditable();
        await expect(notification).toBeAttached();
        await expect(notification).toBeVisible();
        await expect(username).toBeFocused();
        await expect(page.locator('.login-button')).toHaveClass('btn primary');
        await expect(page.locator('.login-button')).toContainClass('btn primary');
        await expect(rows).toHaveCount(10);
        await expect(page.locator('.login-button')).toHaveId('btn primary');        
        await expect(page.locator('.login-button')).toHaveJSProperty('btn primary','value');
        await expect(page.locator('.login-button')).toHaveCSS('background-color', 'rgb(0, 128, 0)');
        await expect(page).toHaveScreenshot('dashboard.png');

        await expect(page.getByLabel('Username')).toBeEmpty();
        const editable = await page.getByRole('textbox').isEditable();
        await expect(checkbox).toBeChecked();
        console.log(await message.isVisible());
        console.log(await message.isHidden());
        console.log(await checkbox.isChecked());

        expect(message).toContain('successful');
        expect(actual).toEqual(expected); //It compares nested object and array contents 
        expect(actual).toStrictEqual(expected); //similae to equal
        expect(email).toMatch(/@gmail\.com$/);

        await expect(page.getByText('Pankaj'),'Employee name should be visible on the profile page').toBeVisible(); //custom message


        //negative assertion
        await expect(page.getByText('Error')).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Delete' })).not.toBeEnabled();


        //forceClick
        await page.getByRole('button', {
        name: 'Submit'
        }).click({ force: true });



        //trial
        await submitButton.click({ trial: true });
        // Actual click
        await submitButton.click();


        //clear selected option
        await page.locator('#skills').selectOption([]);


        //Scroll till a particular element
        const targetItem = page.getByText('Employee 100', {
            exact: true
        });

        const listContainer = page.locator('.employee-list');

        for (let i = 0; i < 20; i++) {

            if (await targetItem.isVisible()) {
                break;
            }

            await listContainer.evaluate(element => {
                element.scrollTop = element.scrollHeight;
            });

            await page.waitForTimeout(500);
        }
        await expect(targetItem).toBeVisible();


        //wait
        await page.waitForURL('**/dashboard');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('load');
        await page.waitForLoadState('networkidle');



        //wait for request
        const requestPromise = page.waitForRequest(request =>
            request.url().includes('/api/employees') &&
            request.method() === 'GET'
        );

        await page.getByRole('button', {
            name: 'Search'
        }).click();
        const request = await requestPromise;
        console.log(request.url());
        console.log(request.method());


        //wait for response
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('/api/employees') &&
            response.request().method() === 'GET'
        );

        await page.getByRole('button', {
            name: 'Search'
        }).click();
        const response = await responsePromise;
        console.log(response.status());
        expect(response.status()).toBe(200);


        //wait for event
        const popupPromise = page.waitForEvent('popup');

        await page.getByRole('link', {
            name: 'Open Report'
        }).click();

        const popup = await popupPromise;
        await expect(popup).toHaveURL(/report/);

        //wait for selector
        await page.waitForSelector('#username');

        
        //expectPoll - Wait until a backend job is completed
        await expect.poll(async () => {
            const response = await page.request.get(
                'https://api.example.com/jobs/123'
            );
            const data = await response.json();
            return data.status;
        }, {
            timeout: 30000,
            intervals: [1000, 2000, 3000]
        }).toBe('COMPLETED');


        //expectPass - toPass() retries an entire block of code until all assertions inside that block pass.
        await expect(async () => {

            const status = await page.locator(
                '.order-status'
            ).innerText();

            expect(status).toBe('Completed');

            const amount = await page.locator(
                '.order-amount'
            ).innerText();

            expect(amount).toBe('$500');

        }).toPass({
            timeout: 15000,
            intervals: [500, 1000, 2000]
        });



        //pop-up

        import { test, expect } from '@playwright/test';

        test('handle popup page', async ({ page }) => {
            await page.goto('https://example.com');
            const [popup] = await Promise.all([
                page.waitForEvent('popup'),
                page.getByText('Open new page').click()
            ]);
            await popup.waitForLoadState();
            console.log(await popup.title());
            await expect(popup).toHaveURL(/dashboard/);
        });

        test('listen for popup', async ({ page }) => {
        await page.goto('https://example.com');
        page.on('popup', async popup => {
            console.log('Popup opened');
            await popup.waitForLoadState();
            console.log(await popup.url());
            console.log(await popup.title());
        });
        await page.getByText('Open new page').click();
        });
});


//frames
test('get all frames', async ({ page }) => {
    await page.goto('https://example.com');
    const frames = page.frames();
    console.log('Total frames:', frames.length);
    for (const frame of frames) {
        console.log('Frame URL:', frame.url());
        console.log('Frame name:', frame.name());
    }

    const frame = page.frame({ name: 'login-frame' });
    await frame.locator('#login').click();

    const loginFrame = page.frameLocator('#login-frame');
    await loginFrame.getByLabel('Username').fill('pankaj');

    //nestedframe
    const childFrame = page.frameLocator('#parent-frame').frameLocator('#child-frame');
    await childFrame.getByRole('button', {
        name: 'Submit'
    }).click();

    //cookies
    const cookies = await page.context().cookies();
    const cookies = await page.context().cookies(['https://example.com']);
    await context.addCookies([
    {
        name: 'session_id',
        value: 'abc123',
        domain: 'example.com',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) + 3600
    }
    ]);
    await context.clearCookies();
    await context.clearCookies({name: 'session_id'});



});








 
 