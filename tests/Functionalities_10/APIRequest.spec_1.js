import { test, expect, request } from '@playwright/test';

test('get all users', async ({ request }) => {
    
    const response = await request.get(
        'https://jsonplaceholder.typicode.com/users'
    );
    expect(response.status()).toBe(200);
    const users = await response.json();
    console.log(users);


});


test('create API context', async () => {
    const apiContext = await request.newContext({
        baseURL: 'https://example.com'
    });

    const response = await apiContext.get('/api/users');
    expect(response.ok()).toBeTruthy();
    await apiContext.dispose();

});


//get
test('get users', async ({ request }) => {
    const response = await request.get(
        'https://api.example.com/users'
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(body);

});


//post
test('create user', async ({ request }) => {
    const response = await request.post(
        'https://api.example.com/users',
        {
            data: {
                name: 'Pankaj',
                email: 'pankaj@test.com',
                role: 'admin'
            }
        }
    );

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe('Pankaj');
});


//put
const response = await request.put(
    'https://api.example.com/users/101',
    {
        data: {
            name: 'Pankaj Updated',
            email: 'updated@test.com',
            role: 'user'
        }
    }
);
expect(response.status()).toBe(200);


//patch
const response = await request.patch(
    'https://api.example.com/users/101',
    {
        data: {
            email: 'newemail@test.com'
        }
    }
);
expect(response.status()).toBe(200);


//delete
const response = await request.delete(
    'https://api.example.com/users/101'
);
expect(response.status()).toBe(204);


//headers
const response = await request.get(
    'https://api.example.com/users',
    {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-api-version': 'v1'
        }
    }
);

const apiContext = await request.newContext({
    baseURL: 'https://api.example.com',
    extraHTTPHeaders: {
        Accept: 'application/json',
        'x-api-version': 'v1'
    }
});



//queryParameter
const response = await request.get('/users', {
    params: {
        page: 2,
        limit: 10,
        role: 'admin'
    }
});


//pathParameter
const userId = 101;
const response = await request.get(`/users/${userId}`);
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.id).toBe(userId);


//jsonPayload
const response = await request.post('/users', {
    data: JSON.stringify({
        name: 'Pankaj'
    }),
    headers: {
        'Content-Type': 'application/json'
    }
});



//form-type
const response = await request.post('/login', {
    form: {
        username: 'pankaj',
        password: 'test123'
    }
});
expect(response.status()).toBe(200);


//multipart request
const response = await request.post('/upload', {
    multipart: {
        name: 'Pankaj',
        department: 'QA',
        file: {
            name: 'report.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('Test execution report')
        }
    }
});
expect(response.status()).toBe(200);


//authentication-Headers
const token = process.env.API_TOKEN;
const response = await request.get('/users', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
expect(response.status()).toBe(200);


//basicAuthentication
const response = await request.get('/protected', {
    httpCredentials: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD
    }
});


//responsebodyValidation
est('validate user response', async ({ request }) => {
    const response = await request.get('/users/101');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(101);
    expect(body.name).toBe('Pankaj');
    expect(body.email).toContain('@');
    expect(body.role).toBe('admin');

    //array validation
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);


    //header
    const response = await request.get('/users');
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
});


//responseTime
test('validate API response time', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/users');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(`Response time: ${responseTime} ms`);
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(2000);
});


//schema validation
//npm install ajv

const userSchema = {
    type: 'object',
    required: ['id', 'name', 'email', 'role'],
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        role: { type: 'string' }
    },
    additionalProperties: false
};

import Ajv from 'ajv';
const ajv = new Ajv({ allErrors: true });

test('validate user schema', async ({ request }) => {
    const response = await request.get('/users/101');
    expect(response.status()).toBe(200);
    const body = await response.json();
    const validate = ajv.compile(userSchema);
    const isValid = validate(body);
    expect(isValid, JSON.stringify(validate.errors)).toBeTruthy();
});



//api chaining
est('create user and order', async ({ request }) => {

    const userResponse = await request.post('/users', {
        data: {
            name: 'Pankaj',
            email: 'pankaj@test.com'
        }
    });

    expect(userResponse.status()).toBe(201);

    const user = await userResponse.json();

    const orderResponse = await request.post('/orders', {
        data: {
            userId: user.id,
            product: 'Laptop',
            quantity: 1
        }
    });

    expect(orderResponse.status()).toBe(201);
    const order = await orderResponse.json();
    expect(order.userId).toBe(user.id);
});


//api with db validation
test('validate user in database', async ({ request }) => {
    const response = await request.post('/users', {
        data: {
            name: 'Pankaj',
            email: 'pankaj@test.com'
        }
    });

    expect(response.status()).toBe(201);
    const user = await response.json();
    const dbUser = await db.query(
        'SELECT * FROM users WHERE id = ?',
        [user.id]
    );
    expect(dbUser[0].name).toBe('Pankaj');
    expect(dbUser[0].email).toBe('pankaj@test.com');
});