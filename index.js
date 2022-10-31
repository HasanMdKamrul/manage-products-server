const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
  } finally {
  }
};

run().catch((e) => console.log(e));

// ** app listen to the port

app.listen(port, () => console.log(`server is running in port ${port}`));
