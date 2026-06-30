//import { test, expect } from '@playwright/test';

const {test,expect} = require('@playwright/test');
const path = require('path');

test('Test1', async ({browser}) => {

});

test('Test2', async function({page}) {
  
});

test.only('StandAlone', async ({page}) => {
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await console.log(await page.title());
  await expect(page).toHaveTitle("OrangeHRM");
  await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
});


//2

test('@Web Browser Context-Validating Error login', async ({browser})=>
 {
   
      const context = await browser.newContext();
      const page =  await context.newPage();
  
   const email = "anshika@gmail.com";
   const productName = 'zara coat 3';
   const products = page.locator(".card-body");
   
   //locator
   //css
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").type("Iamking@000");
   await page.locator("[value='Login']").click();
   //text 
   await page.locator("text= Add To Cart").click();
   //has-text
   await page.locator("h3:has-text('zara coat 3')").isVisible();
   
   await page.waitForLoadState('networkidle'); // wait for page to get stable and all network calls made
   await page.locator("single element").waitFor(); //wait for the element to appear explicitly
   await page.locator(".card-body b").first().waitFor();
   await page.locator("").fill(""); //to empty content 


   const text = await page.locator(".card-body b").textContent();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   await page.locator(".card-body b").nth(1).textContent();


  //expect
   await expect(page.locator(".card-body b")).toContainText("");
   await expect(page.locator(".radiotextsty").last()).toBeChecked();
   expect(await page.locator("#terms").isChecked()).toBeFalsy();
   await expect(page.locator("")).toHaveAttribute("class","blinkingText");
 
 });


 test('@Web UI Controls', async ({page})=>
 {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const signIn = page.locator("#signInBtn");
    const documentLink = page.locator("[href*='documents-request']");

    //dropdown
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult");

    //radiobutton
    await page.locator(".radiotextsty").last().click(); //check
    await page.locator("#okayBtn").click();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await expect(page.locator(".radiotextsty").last()).toBeChecked();

    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck(); //uncheck

    expect( await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class","blinkingText");
 });


 test('@Child windows handle', async ({browser})=>
 {
    const context = await browser.newContext();
    const page =  await context.newPage();
    const userName = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage]=Promise.all(
   [
      context.waitForEvent('page'),//listen for any new page pending,rejected,fulfilled
      documentLink.click(),
   
   ])//new page is opened

    const  text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@")
    const domain =  arrayText[1].split(" ")[0]
    console.log(domain);

    await page.locator("#username").fill(domain);
    console.log(await page.locator("#username").textContent());
    console.log(await page.locator("#username").inputValue()); //get value for the element which is dyanamically set, textcontent returns the value when it is set in dom statically

 })



 //E2E
 test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'ZARA COAT 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.locator("#userEmail").fill(email);
   await page.locator("#userPassword").fill("Iamking@000");
   await page.locator("[value='Login']").click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   const titles = await page.locator(".card-body b").allTextContents();
   console.log(titles); 
   const count = await products.count();

   for (let i = 0; i < count; ++i) {
      if (await products.nth(i).locator("b").textContent() === productName) {
         //add to cart
         await products.nth(i).locator("text= Add To Cart").click();
         break;
      }
   }

   await page.locator("[routerlink*='cart']").click();
   //await page.pause();

   await page.locator("div li").first().waitFor();
   const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
   expect(bool).toBeTruthy();
   await page.locator("text=Checkout").click();

   await page.locator("[placeholder*='Country']").pressSequentially("ind");
   const dropdown = page.locator(".ta-results");
   await dropdown.waitFor();
   const optionsCount = await dropdown.locator("button").count();
   for (let i = 0; i < optionsCount; ++i) {
      const text = await dropdown.locator("button").nth(i).textContent();
      if (text === " India") {
         await dropdown.locator("button").nth(i).click();
         break;
      }
   }

   expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);

   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");


   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();

});



//Locators
test('Playwright Special locators', async ({ page }) => {
  
    await page.goto("https://rahulshettyacademy.com/angularpractice/");

    //GetByLabel is inconsistent when it comes to typing, for other operations it is good
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");


    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole("link",{name : "Shop"}).click();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();
});


test('@Webst Client App login', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'ZARA COAT 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.getByPlaceholder("email@example.com").fill(email);
   await page.getByPlaceholder("enter your passsword").fill("Iamking@000");
   await page.getByRole('button',{name:"Login"}).click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   
   await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
   .getByRole("button",{name:"Add to Cart"}).click();
 
   await page.getByRole("listitem").getByRole('button',{name:"Cart"}).click();
 
   //await page.pause();
   await page.locator("div li").first().waitFor();
   await expect(page.getByText("ZARA COAT 3")).toBeVisible();
   await page.getByRole("button",{name :"Checkout"}).click();
   await page.getByPlaceholder("Select Country").pressSequentially("ind");
   await page.getByRole("button",{name :"India"}).nth(1).click();
   await page.getByText("PLACE ORDER").click();
   await expect(page.getByText("Thankyou for the order.")).toBeVisible();
})


//Calendar
test("Calendar validations",async({page})=>
{
    const monthNumber = "6";
    const date = "15";
    const year = "2027";
    const expectedList = [monthNumber,date,year];
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
    await page.locator("//abbr[text()='"+date+"']").click();
    const inputs = await page.locator(".react-date-picker__inputGroup input");
    
    for (let index = 0; index <inputs.length; index++)
    {
        const value =inputs[index].getAttribute("value");
        expect(value).toEqual(expectedList[index]);
    }
})





//MoreValidations
//test.describe.configure({mode:'parallel'});
//test.describe.configure({mode:'serial'});

test("@Web Popup validations",async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // await page.goto("http://google.com");
    // await page.goBack();
    // await page.goForward();

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
   // await page.pause();
    page.on('dialog',dialog => dialog.accept());

    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck =await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);
})

test("Screenshot & Visual comparision",async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator('#displayed-text').screenshot({path:'partialScreenshot.png'});
    await page.locator("#hide-textbox").click();
    await page.screenshot({path: 'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
});

//screenshot -store -> screenshot -> 
test('visual',async({page})=>
{
    //make payment -when you 0 balance
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    expect(await page.screenshot()).toMatchSnapshot('landing.png');

})


//    // page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
    //  page.on('request',request=> console.log(request.url()));
      // page.on('response',response=> console.log(response.url(), response.status()));
   

//this is enough for now!!!


/*---------------------------------------Refer from here -----------------------------*/

const { test, expect } = require('@playwright/test');
import { test, expect } from '@playwright/test';

test.describe.configure({mode:'parallel'});
test.describe.configure({mode:'serial'});
test.describe.configure({retries: 2 });

test('Pratice Test', async ({ browser }) => {

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
    page.locator("").dblclick();

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
    age.getByText("PLACE ORDER").click();
    page.getByLabel("")
    page.getByTestId("")


    //************************ Dropdown ************************
    const dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult");

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
    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    expect(page.locator("[style*='block']")).toBeChecked();
    expect(page.getByText("Thankyou for the order.")).toBeVisible();
    expect(page.locator("#displayed-text")).toBeHidden();
    expect(page.locator("")).toHaveAttribute('class', 'blinkingText');

    expect(page.locator("[style*='block']").isChecked()).toBeTruthy();
    expect(page.locator("[style*='block']").isDisabled).toBeFalsy();
    expect(page.locator("[style*='block']").isEditable()).toBeFalsy();
    expect(page.locator("[style*='block']").isEnabled()).toBeFalsy();
    expect(page.locator("[style*='block']").isHidden()).toBeFalsy();
    expect(page.locator("[style*='block']").isVisible()).toBeFalsy();

    const aexp = 'hello';
    const bexp = 'he';
    expect(aexp.includes(bexp)).toBeTruthy();


    //************************ Api ************************
    page.route('**/*.{jpg,png,jpeg}', route => route.abort()); //**/* means any link
    page.on('request', request => console.log(request.url())); //on means whenever request event occurs
    page.on('response', response => console.log(response.url(), response.status())); //on means whenever request event occurs


    //************************ Child window ************************
    const documentLink = page.locator("[href*='documents']");
    const [newPage] = await Promise.all([
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

test.beforeAll('',()=>{});
test.beforeEach('',()=>{});
test.afterEach('',()=>{});
test.afterAll('',()=>{});
test.skip('',()=>{});
test.only('',()=>{});

test.beforeEach(async ({ page }) => {
    
    await page.dragAndDrop('#source', '#target');
    
    await page.keyboard.press('Enter');
    await page.keyboard.type('Hello');

    await expect.soft(page.locator("h1")).toHaveText("Hello");

    await context.tracing.start({ screenshots: true, snapshots: true });
    await context.tracing.stop({ path: 'trace.zip' });
});

test.afterEach(async ({ page }) => {
    console.log("Test completed");
});

test.skip('Pratice Test 2', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});

test.skip('Pratice Test 3', async function ({ page }) {

    //download
    const [download] = await Promise.all([
    page.waitForEvent('download'), // Waits for the download to start
    //page.getByRole('button', { name: /^Download as PDF$/ }).click()
    page.locator("button[class*='no_print']:first-of-type").first().click()
    ]);
    await download.saveAs('/Users/pankajshukla/Downloads/invoice.pdf');
    const path = await download.path();


    await page.getByText("Back to Home",{exact:true}).click();

    await page.getByRole('button', { name: /^Download as PDF$/ }).scrollIntoViewIfNeeded();

    await bookingW.first().waitFor({state:'visible'});

    await page.locator(".form-floating").filter({has : page.locator("#t-passport-1")}).locator("input").fill("1234567AJSH")

    await page.getByRole('option', { name: /^India$/ }).first().scrollIntoViewIfNeeded();

    await expect(totalPrice.replaceAll(",","").trim()).toBe(highPrice.replaceAll(",","").trim());

    await expect(page.getByPlaceholder("Flying From").last()).toHaveValue(/HKT/i);

    await page.waitForSelector(".dropdown-menu.inner.show li a", { state: "visible" });



});






 
 