const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = 5000;


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jpgna.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("tour");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection("orders");


        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query);

            res.send(result);
        });

        // Post api for add new Service
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const addNewService = {
                title: newService.title,
                country: newService.country,
                img: newService.img,
                cost: newService.cost,
                description: newService.description,
            }

            const result = await servicesCollection.insertOne(addNewService);
            console.log(result);
            res.json(result);
        });

        // GET API for orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.findOne(query);
            console.log(result);
            res.send(result);
        })

        // UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            console.log(updateOrder);

            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    serviceId: updateOrder.serviceId,
                    orderStatus: updateOrder.orderStatus,
                    userName: updateOrder.userName,
                    userPhoneNumber: updateOrder.userPhoneNumber,
                    userEmail: updateOrder.userEmail,
                    userAddress: updateOrder.userAddress,
                    title: updateOrder.title,
                    cost: updateOrder.cost,
                    country: updateOrder.country
                }
            }

            const result = await ordersCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        });

        // Post API for orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const doc = {
                serviceId: order.serviceId,
                orderStatus: order.orderStatus,
                userName: order.userName,
                userPhoneNumber: order.userPhoneNumber,
                userEmail: order.userEmail,
                userAddress: order.userAddress,
                title: order.title,
                cost: order.cost,
                country: order.country
            }

            const result = await ordersCollection.insertOne(doc);
            // console.log(result);
            res.json(result);
        });

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };

            const result = await ordersCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});