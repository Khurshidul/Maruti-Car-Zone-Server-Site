const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v3x1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("car's-zone");
        const productsCollection = database.collection('products');
        const exploreCollection = database.collection('explore');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('myOrder');
        const adminCollection = database.collection('admin');
        const reviewMessageCollection = database.collection('reviews');
        console.log('connected successfully');

        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        })
        app.get('/explore', async (req, res) => {
            const cursor = exploreCollection.find({});
            const exploreProducts = await cursor.toArray();
            res.json(exploreProducts);
        })
        //find one from prodcuts
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const singleProduct = await productsCollection.findOne(query);
            res.json(singleProduct);
        });
        //find one from explore
        app.get('/explore/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const singleProduct = await exploreCollection.findOne(query);
            res.json(singleProduct);
        });
        //Manage Explore Products
        app.delete('/explore/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await exploreCollection.deleteOne(query);
            res.json(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        //find user
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.json(users);
        });
        //Insert Order 
        app.post('/myOrder', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result);
        });
        //Find all orders
        app.get('/myOrder', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });

        app.delete('/myOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
        //Make Admin
        app.post('/admin', async (req, res) => {
            const admin = req.body;
            const result = await adminCollection.insertOne(admin);
            console.log(result);
            res.json(result);
        });
        app.get('/admin', async (req, res) => {
            const cursor = adminCollection.find({});
            const admin = await cursor.toArray();
            res.json(admin);
        });
        //Review Products
        app.post('/reviews', async (req, res) => {
            const message = req.body;
            const result = await reviewMessageCollection.insertOne(message);
            console.log(result);
            res.json(result);
        });
        //Get review message
        app.get('/reviews', async (req, res) => {
            const cursor = reviewMessageCollection.find({});
            const message = await cursor.toArray();
            res.json(message);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)





app.get('/', (req, res) => {
    res.send("Server is ready");
});

app.listen(port, () => {
    console.log("Hello server!");
});