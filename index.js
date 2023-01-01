const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// // middlewares
app.use(cors());
app.use(express.json());


// server connection database link
const uri = `mongodb+srv://${process.env.PRODUCT_DB_NAME}:${process.env.DB_PASSWORD}@cluster0.exe7q4w.mongodb.net/?retryWrites=true&w=majority`;
// server connection client site link
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// ===========
async function run() {
    try {
        await client.connect();
        console.log("Database connected");
    } catch (error) {
        console.log(error.name, error.message.bold);
    }
}
run().catch(err => console.error(err))




// create database collection
const servicesCollection = client.db('productsCrud').collection('services');
const reviewCollection = client.db('productsCrud').collection('reviews');

// POST Method diye data create korte hoi
app.post('/services', async (req, res) => {
    try {
        const insertCreateProduct = req.body;
        const result = await servicesCollection.insertOne(insertCreateProduct);
        if (result.insertedId) {
            res.send({
                success: true,
                message: `Successfully create the ${req.body.name} with id ${result.insertedId}`
            });
        } else {
            res.send({
                success: false,
                message: "couldn't create the product"
            });
        }
    } catch (error) {
        console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }

})


// product list show dashbord display;
app.get('/services', async (req, res) => {
    try {
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
        res.send({
            success: true,
            message: 'seccessfully create product',
            data: services
        })
    } catch (error) {
        console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }
})
// id face
// services client site a product show
app.get("/services/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const service = await servicesCollection.findOne({ _id: ObjectId(id) });
        res.send({
            success: true,
            data: service,
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});


//reviews POST Method diye data create korte hoi
app.post('/reviews', async (req, res) => {
    try {
        const insertCreateProduct = req.body;
        const result = await reviewCollection.insertOne(insertCreateProduct);
        if (result.insertedId) {
            res.send({
                success: true,
                message: `Successfully create the ${req.body.name} with id ${result.insertedId}`
            });
        } else {
            res.send({
                success: false,
                message: "couldn't create the product"
            });
        }
    } catch (error) {
        console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }

})

app.get('/reviews', async (req, res) => {
    try {
        const query = {};
        const cursor = reviewCollection.find(query);
        const review = await cursor.toArray();
        res.send({
            success: true,
            message: 'seccessfully create product',
            data: review
        })
    } catch (error) {
        console.log(error.name, error.message);
        res.send({
            success: false,
            error: error.message,
        });
    }
})

//========= update =============
// step 1 product find
app.get("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const review = await reviewCollection.findOne({ _id: ObjectId(id) });
        res.send({
            success: true,
            data: review,
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});
// step 2  
app.patch("/reviews/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });

        if (result.matchedCount) {
            res.send({
                success: true,
                message: `successfully updated ${req.body.name}`,
            });
        } else {
            res.send({
                success: false,
                error: "Couldn't update  the product",
            });
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});


// =====
app.delete("/reviews/:id", async (req, res) => {
    const { id } = req.params;
    try {
        review = await reviewCollection.findOne({ _id: ObjectId(id) });
        if (!review?._id) {
            res.send({
                success: false,
                error: "Product doesn't exist",
            });
            return;
        }
        const result = await reviewCollection.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount) {
            res.send({
                success: true,
                message: `Successfully deleted the ${review.name}`,
            });
        } else {
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});


// =========== Endpoint end ===================


//-------=======---------
app.get('/', (req, res) => {
    res.send('product card server is working')
})
app.listen(port, () => {
    console.log(`server site is running on ${port}`)
})