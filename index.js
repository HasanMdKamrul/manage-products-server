const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 15000;

// ** use middle ware

app.use(cors());
app.use(express.json());

// ** initial api endpoint

app.get("/", (req, res) => res.send("App is running"));

// ** DB connection

// user : dbuser4
//  pass : ePxdtZXh1oTFfc3P

const uri =
  "mongodb+srv://dbuser4:ePxdtZXh1oTFfc3P@cluster0.7ikallh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const productsCollection = client
      .db("productsManagement")
      .collection("products");

    app.post("/add", async (req, res) => {
      const productsInfo = req.body;
      const result = await productsCollection.insertOne(productsInfo);
      console.log(result);
      res.send(result);
    });

    app.get("/add", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const productsData = await cursor.toArray();
      res.send(productsData);
    });

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await productsCollection.deleteOne(query);
      console.log(result);
      console.log("deleted");
      res.send(result);
    });

    // ** get data from DB for update operation

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const product = await productsCollection.findOne(query);
      console.log(product);
      console.log("single product data retrived");
      res.send(product);
    });

    app.put("/product/update/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;

      const { productName, quantity, price, picture } = updatedProduct;

      const filter = {
        _id: ObjectId(id),
      };

      const options = { upsert: true };
      const product = {
        $set: {
          productName,
          price,
          quantity,
          picture,
        },
      };

      const result = await productsCollection.updateOne(
        filter,
        product,
        options
      );

      console.log(result);
      console.log("data Updated");
      res.send(result);
    });
  } finally {
  }
};

run().catch((e) => console.log(e));

// ** app listen to the port

app.listen(port, () => console.log(`server is running in port ${port}`));
