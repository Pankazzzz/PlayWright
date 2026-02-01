const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('../utils/APiUtils');
const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "6262e95ae26b7e1a10e89bf0" }] };
const fakePayLoadOrders = { data: [], message: "No Orders" };

let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);

})


//create order is success
test('@SP Place the order', async ({ page }) => {
  page.addInitScript(value => {

    window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");


  //page.route means whenever this api is called(1st parameter), perform that operation(2nd parameter)
  await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    
    async route => {
      const response = await page.request.fetch(route.request()); //get the response of API call , route may have session,cookies, request so we sending request
      
      let body = JSON.stringify(fakePayLoadOrders);
      
      //fulfill method will continue request, here we can do any modification
      route.fulfill(
        {
          response,
          body, 

        });
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });

  await page.locator("button[routerlink*='myorders']").click();

  //actual response and fake response gets mixed up, so we need to synchronize it saying wait for complete response
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")

  console.log(await page.locator(".mt-4").textContent());



});

