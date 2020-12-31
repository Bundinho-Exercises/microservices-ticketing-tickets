import { Types } from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the provided id does not exist', async () => {
    const response = await request(app)
        .put(`/api/tickets/${new Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
        .send({
            title: 'asdfaf',
            price: 200,
        });

    expect(response.status).toEqual(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const response = await request(app)
        .put(`/api/tickets/${new Types.ObjectId().toHexString()}`)
        // .set('Cookie', global.signin())
        .send({
            title: 'asdfaf',
            price: 200,
        });

    expect(response.status).toEqual(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets/')
        .set('Cookie', global.signin())
        .send({
            title: 'fdsafdsa',
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'fdasfdsa',
            price: 34,
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets/')
        .set('Cookie', cookie)
        .send({
            title: 'fdsafdsa',
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'dfsafsa',
            price: -20
        })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets/')
        .set('Cookie', cookie)
        .send({
            title: 'fdsafdsa',
            price: 20,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'New title',
            price: 100,
        })
        .expect(200);

    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

    expect(ticketResponse.body.title).toEqual('New title');
    expect(ticketResponse.body.price).toEqual(100);    
});