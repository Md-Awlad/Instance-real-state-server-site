const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;

// meddleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixmy4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {

    }finally{
        await client.connect();
        const database = client.db('instanse-realestate');
        const productsDb = database.collection('products');
        const myorderDB = database.collection('myorder');
        const reviewDB = database.collection('review');
        const userDB = database.collection('user');
        // load data 
        app.get('/products', async(req,res)=>{
            const quary = productsDb.find({});
            const products = await quary.toArray();
            res.json(products);
        })
        // post new products 
        app.post('/products',async(req,res)=>{
            const quary = req.body;
            console.log(quary)
            const result = await productsDb.insertOne(quary)
            res.json(result)
        })
        // delet products 
        app.delete('/products/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id)
            const quary = {_id: ObjectId(id)};
            const result = await productsDb.deleteOne(quary);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
              } else {
                console.log("No documents matched the query. Deleted 0 documents.");
              }
            res.json(result)
        })
        // post my order data 
        app.post('/my-order',async(req,res)=>{
            const quary = req.body;
            const result = await myorderDB.insertOne(quary)
            res.json(result)
        })
        // load myorder 
        app.get('/my-order',async(req,res)=>{
            const quary = myorderDB.find({});
            const orders = await quary.toArray();
            res.json(orders);
        })
        // reviews 
        app.post('/review',async(req,res)=>{
            const quary = req.body;
            const result = await reviewDB.insertOne(quary)
            res.json(result)
        })
        // get reviws 
        app.get('/review',async(req,res)=>{
            const quary = reviewDB.find({});
            const reveiw = await quary.toArray();
            res.json(reveiw);
        })
        // delete orders 
        app.delete('/my-order/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id)
            const quary = {_id: ObjectId(id)};
            const result = await myorderDB.deleteOne(quary);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
              } else {
                console.log("No documents matched the query. Deleted 0 documents.");
              }
            res.json(result)
        })

        // add user 
        app.post('/user',async(req,res)=>{
            const quary = req.body;
            const result = await userDB.insertOne(quary)
            res.json(result)
        })

        // make admin 
        app.put('/user/admin',async(req,res)=>{
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}}
            const result = await userDB.updateOne(filter, updateDoc);
            res.json(result)
        })

    //   is admin check 
    app.get('/user/:email',async(req,res)=>{
        const email = req.params.email;
        console.log(email);
        const quary = {email: email};
        const result = await userDB.findOne(quary);
        let isadmin = false;
        if(result?.role){
            isadmin = true;
        }
        res.json({admin: isadmin});
    })
    }
    }
    run().catch(console.dir)

    app.get('/',(req,res)=>{
        res.send('Its working')
    })
    app.listen(port,()=>{
        console.log('Loading port', port)
    })