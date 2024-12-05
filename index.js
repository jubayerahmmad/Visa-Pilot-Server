require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.anl9s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const visaCollection = client.db("visaDB").collection("allVisas");
    const appliedUsersCollection = client
      .db("visaDB")
      .collection("appliedUsers");

    // all visa collection api
    // post all visas
    app.post("/allVisas", async (req, res) => {
      const allVisa = req.body;
      const result = await visaCollection.insertOne(allVisa);
      res.send(result);
    });

    // get all visa api
    app.get("/allVisas", async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get individual visa api by id
    app.get("/allVisas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.findOne(query);
      res.send(result);
    });

    // appliedUsers api
    // post
    app.post("/appliedUsers", async (req, res) => {
      const appliedUsers = req.body;
      const result = await appliedUsersCollection.insertOne(appliedUsers);
      res.send(result);
    });

    // get all applied users
    app.get("/appliedUsers", async (req, res) => {
      const cursor = appliedUsersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Visa Server is Running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
