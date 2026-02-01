const {test, expect, request} = require('@playwright/test');

const {APiUtils} = require('../utils/APiUtils');
const loginPayLoad = {userEmail:"anshika@gmail.com",userPassword:"Iamking@000"};
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"6262e95ae26b7e1a10e89bf0"}]};


let response;
test.beforeAll( async()=>
{
   const apiContext = await request.newContext(); //1
   const apiUtils = new APiUtils(apiContext,loginPayLoad); //2
   response =  await apiUtils.createOrder(orderPayLoad); //3
})

/* //2
  async getToken()
     {
        const loginResponse =  await  this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:this.loginPayLoad
         } )//200,201,
         expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        const token =loginResponseJson.token;
        console.log(token);
        return token;

    }
*/


/* //3

 async createOrder(orderPayLoad)
    {
    let response = {};
    response.token = await this.getToken();
    const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
   {
    data : orderPayLoad,
    headers:{
                'Authorization' :response.token,
                'Content-Type'  : 'application/json'
            },

   })
   const orderResponseJson =await orderResponse.json();
   console.log(orderResponseJson);
   const orderId = orderResponseJson.orders[0];
   response.orderId = orderId;

   return response;
}

*/


//create order is success
test('@API Place the order', async ({page})=>
{ 

    //Injecting into webpage
    page.addInitScript(value => {
        window.localStorage.setItem('token',value);
    }, response.token );

        await page.goto("https://rahulshettyacademy.com/client");
        await page.locator("button[routerlink*='myorders']").click();
        await page.locator("tbody").waitFor();
        const rows = await page.locator("tbody tr");

        for(let i =0; i<await rows.count(); ++i)
        {
        const rowOrderId =await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId))
        {
            await rows.nth(i).locator("button").first().click();
            break;
        }
        }

        const orderIdDetails =await page.locator(".col-text").textContent();
        //await page.pause();
        expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

});
