const express = require('express')
const app = express()
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const { MongoClient } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// -----------------------//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvlwz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// -----------------------//
async function run() {
    try {
        await client.connect();
        console.log('database collection successfully');
        const database = client.db("jewellery_Shop");
        const jewelleryCollection = database.collection("jewellery");
        const jewelleryOrderCollection = database.collection("jewelleryOrder");
        const jewelleryReviewCollection = database.collection("jewelleryReview");
        const usersCollection = database.collection("jewelleryUser");

        app.get('/jewellerys', async (req, res) => {
            const user = req.body;
            const cursor = jewelleryCollection.find(user)
            const jewellery = await cursor.toArray();
            res.json(jewellery)
        })
        app.post('/jewellerys', async (req, res) => {
            const jewellery = req.body;
            const result = await jewelleryCollection.insertOne(jewellery)
            console.log(jewellery)
            res.json(result)
        })
        // GET SINGLE SERVICES 
        app.get('/jewellerys/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hit id', id)
            const query = { _id: ObjectId(id) };
            const jewellery = await jewelleryCollection.findOne(query);
            res.json(jewellery)
        })
        // DELETE API 
        app.delete('/jewellerys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await jewelleryCollection.deleteOne(query)
            console.log('delete', result)
            res.json(result)
        })

        app.get('/jewellery/totalOrder', async (req, res) => {
            const user = req.body;
            const cursor = jewelleryOrderCollection.find(user);
            const jewellery = await cursor.toArray();
            res.json(jewellery)

        })
        app.get('/jewellery/order', async (req, res) => {

            const email = req.query.email;
            console.log('connect order')
            const query = { email: email }
            const cursor = jewelleryOrderCollection.find(query);
            const jewellery = await cursor.toArray();
            res.json(jewellery)

        })
        app.post('/jewellery/order', async (req, res) => {
            const jewellery = req.body;
            const result = await jewelleryOrderCollection.insertOne(jewellery)
            console.log(jewellery)
            res.json(result)
        })
        // GET SINGLE SERVICES 
        app.get('/jewellery/order/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hit id', id)
            const query = { _id: ObjectId(id) };
            const order = await jewelleryOrderCollection.findOne(query);
            res.json(order)
        })
        // DELETE API 
        app.delete('/jewellery/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await jewelleryOrderCollection.deleteOne(query)
            console.log('delete', result)
            res.json(result)
        })
        app.get('/jewellery/review', async (req, res) => {
            const user = req.body;
            console.log('connect review')
            const cursor = jewelleryReviewCollection.find(user)
            const jewellery = await cursor.toArray();
            res.json(jewellery)
        })
        app.post('/jewellery/review', async (req, res) => {
            const jewellery = req.body;
            const result = await jewelleryReviewCollection.insertOne(jewellery)
            console.log(jewellery)
            res.json(result)
        })

        // jewellery user 
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users)
            res.json(result)
        })
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })
        // admin 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user)
            const filter = { email: user?.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })



    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Jewellery Shop')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})