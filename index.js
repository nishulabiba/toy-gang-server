const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
 app.use(cors());
 app.use(express.json());

 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ubbebrm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("toyManager").collection("toys")

    //insert a toy info to db

    app.get("/marvel", (req, res)=>{
      res.send("All is well")
    })

    app.post("/upload", async(req, res)=>{
      const data = req.body;
      console.log(data)

      const result = await toyCollection.insertOne(data)
      res.send(result)
    })

    app.get('/toys', async(req, res)=> {
      const toys = toyCollection.find()
      const result = await toys.toArray()
      res.send(result)
    })

    app.get('/toy/:id', async(req, res)=>{
      const toy = await toyCollection.findOne({
        _id: new ObjectId(req.params.id)

      })
      res.send(toy)
    })


    app.patch("/update/:id", async(req, res)=>{
      const id = req.params.id;
      const updatedToyDetails = req.body;
      const filter = {_id : new ObjectId(id)}
      const updatedDoc = {
        $set: {
          ...updatedToyDetails
        }
      }
      const result = await toyCollection.updateOne(filter, updatedDoc)
      res.send(result)
    }) 

    app.delete("/delete/:id", async(req, res)=>{
      try{
      
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        
        const result = await toyCollection.deleteOne(filter)
        res.send(result) 
      } catch(err){
        res.send(err.message)
      }
    }) 

    



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);


 app.get('/', (req, res)=>{
    res.send("The site is running")
 })

 app.listen(port, ()=>{
    console.log(`Assignment11 Server is running on port : ${port}`)

 })