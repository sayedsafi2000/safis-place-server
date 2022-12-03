const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());
require("dotenv").config();

app.get("/", (req, res) => {
    res.send("genius car running")
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ldps5dz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

    try {
        const productsCollection = client.db("safis-place").collection("products");
        const ordersCollection = client.db("safis-place").collection("orders")

        app.get("/productsAll",async(req,res)=>{
            const query = {}
            const cursor = productsCollection.find(query);
            const products = await cursor.limit(3).toArray();
            res.send(products)
        })


        app.get("/products",async(req,res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page,size);
            const query = {}
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount()
            res.send({count,products})
        })
        app.get("/products/:id",async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query);
            res.send(product);
        })
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result)
        });

    }
    finally {

    }
}
run().catch(err => console.error(err))


app.listen(port, () => {
    console.log(`genius car running on port ${port}`)
})