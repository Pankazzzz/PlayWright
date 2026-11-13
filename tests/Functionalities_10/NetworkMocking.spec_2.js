import { test } from '@playwright/test';

test('monitor network events', async ({ page }) => {
  
  await page.goto('https://example.com');

    //1
    page.on('request', request => {
        console.log('REQUEST:', request.method(), request.url());
    });

    page.on('response', response => {
        console.log(
        'RESPONSE:',
        response.status(),
        response.url()
        );
    });


    //2
    const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/users')
    );

    await page.getByRole('button', { name: 'Load Users' }).click();
    const response = await responsePromise;
    console.log(response.status());
    console.log(await response.json());

    //3
    await page.route('**/api/users', async route => {
        console.log(route.request().url());
        await route.continue();
    });


    //4
    test('intercept requests at context level', async ({ context, page }) => {
    
        await context.route('**/api/**', async route => {
        console.log(route.request().url());
        await route.continue();
    });
    await page.goto('https://example.com');
    });

    //5 - continue
    await page.route('**/api/users', async route => {
    await route.continue({
        headers: {
        ...route.request().headers(),
        'x-test-client': 'playwright',
        authorization: 'Bearer test-token',
        'x-secret': undefined //to remove a header set its value as undefined

        }
    });

    //6 - fulfill
    await page.route('**/api/users', async route => {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
        { id: 1, name: 'Pankaj' },
        { id: 2, name: 'Rahul' }
        ])
    });
    });

    //7 - abort
    await page.route('**/api/users', async route => {
    await route.abort('failed');
    });
    
    //8 - route.fallback()
    //Passes the request to the next matching route handler instead of immediately sending it to the server.
        await page.route('**/api/**', async route => {
        console.log('General route');
        await route.fallback();
        });

    await page.route('**/api/users', async route => {
    console.log('Users route');
    await route.fulfill({
        status: 200,
        body: JSON.stringify([{ id: 1, name: 'Pankaj' }]),
        contentType: 'application/json'
    });

    //9
    await page.route('**/api/users', async route => {
    const response = await route.fetch();
    const users = await response.json();

        users.push({
        id: 100,
        name: 'Mock User'
        });

        await route.fulfill({
        response,
        body: JSON.stringify(users)
        });
    });
    });


    //10 - modify request
    await page.route('**/api/users', async route => {
    const request = route.request();
    const body = request.postDataJSON();
    body.name = 'Updated User';

    await route.continue({
        postData: JSON.stringify(body)
    });
    });

    //You can also change the HTTP method or URL:
    await page.route('**/api/users', async route => {
    await route.continue({
        method: 'POST',
        url: 'https://example.com/api/test-users'
        });
    });


    //11 -  modify response body
    await page.route('**/api/users', async route => {
    const response = await route.fetch();
    const users = await response.json();

    users.push({
        id: 101,
        name: 'Automation User'
    });

    await route.fulfill({
        response,
        json: users
    });
    });


    //12 - mocking different error messages
    const errorResponses = [
    { status: 400, message: 'Bad Request' },
    { status: 401, message: 'Unauthorized' },
    { status: 403, message: 'Forbidden' },
    { status: 404, message: 'User Not Found' },
    { status: 500, message: 'Internal Server Error' }
    ];

    for (const error of errorResponses) {
    test(`handle API error ${error.status}`, async ({ page }) => {
        await page.route('**/api/users', async route => {
        await route.fulfill({
            status: error.status,
            contentType: 'application/json',
            body: JSON.stringify({
            message: error.message
            })
        });
        });

        await page.goto('https://example.com/users');

        await expect(
        page.getByText(error.message)
        ).toBeVisible();
        });
        }

        //13 - simulating slow api
        await page.route('**/api/users', async route => {
        await new Promise(resolve => setTimeout(resolve, 5000));

        await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
        { id: 1, name: 'Pankaj' }
        ])
        });
        });

    //14 - simulating network failure
    await page.route('**/api/users', async route => {
    await route.abort('failed');
    });

    //You can also observe the failure:
    page.on('requestfailed', request => {
    console.log('Failed URL:', request.url());
    console.log('Failure:', request.failure()?.errorText);
    });


    //15 - blocking resource
    await page.route('**/*', async route => {
    const type = route.request().resourceType();

    if (['image', 'font', 'media'].includes(type)) {
        await route.abort();
    } else {
        await route.continue();
    }
    });



    //16 - HTTP Archieve
    // HAR stands for HTTP Archive. It is a file containing recorded network interactions, such as URLs, request methods, headers, response statuses and response content.
    // It is useful when you want to reproduce network behavior without depending on a live backend.

    // A. HAR recording — recordHar
    // You can record network traffic while running a test.
    import { test, chromium } from '@playwright/test';

    test('record network traffic', async () => {
      const browser = await chromium.launch();

      const context = await browser.newContext({
        recordHar: {
          path: 'har/users.har',
          content: 'embed'
        }
      });

      const page = await context.newPage();

      await page.goto('https://example.com/users');

      await context.close();
      await browser.close();
    });
    // Closing the context is important because the HAR file is written when the context closes.


    // B. HAR replay — routeFromHAR()
    // Once you have recorded the HAR file, you can replay it in another test.
    import { test, expect } from '@playwright/test';

    test('replay network from HAR', async ({ page }) => {
      await page.routeFromHAR('har/users.har', {
        notFound: 'abort'
      });

      await page.goto('https://example.com/users');

      await expect(
        page.getByRole('heading', { name: 'Users' })
      ).toBeVisible();
    });

    // notFound controls what happens when a request is not present in the HAR:
    // abort: fail the unmatched request. 
    // fallback: let the unmatched request go to the network or next matching route handler.


    //17 -  websocket monitoring
    test('monitor WebSocket traffic', async ({ page }) => {
    page.on('websocket', ws => {
    console.log('WebSocket URL:', ws.url());

    ws.on('framesent', event => {
      console.log('Sent:', event.payload);
    });

    ws.on('framereceived', event => {
      console.log('Received:', event.payload);
    });

    ws.on('close', () => {
      console.log('WebSocket closed');
    });
   });

    await page.goto('https://example.com/dashboard');
    });

    //18 - websocket mocking
    test('mock WebSocket response', async ({ page }) => {
    await page.routeWebSocket('**/ws', ws => {
    ws.onMessage(message => {
      if (message === 'get-status') {
        ws.send(JSON.stringify({
          status: 'CONNECTED'
        }));
      }
        });
    });

    await page.goto('https://example.com/dashboard');
    });

});
});