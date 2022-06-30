const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.foxet.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const todoBooking = client.db("to_do").collection("data");

    app.post("/todo", async (req, res) => {
      const service = req.body;
      const result = await todoBooking.insertOne(service);
      res.send(result);
    });



    app.get('/todo/:email',async(req,res)=>{
      const email = req.params.email;
      const filter = {email:email}
      const result = await todoBooking.find(filter).toArray()
      res.send(result)
    })
    
    
    app.patch('/todo/:id',async(req,res)=>{
      const id = req.params.id;
      const updateData = req.body;
      const filterId = {_id:ObjectId(id)}
      const updateDoc = {
        $set: {
            name:updateData.name,
            desc:updateData.desc
        },
      };
      const result = await todoBooking.updateOne(filterId,updateDoc)
      res.send(result)
    })
    app.put('/todo/:id',async(req,res)=>{
      const id = req.params.id;
      const filterId = {_id:ObjectId(id)}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
            status:"completed",
            updated:true
        },
      };
      const result = await todoBooking.updateOne(filterId,updateDoc,options)
      res.send({result,message:"true"})
    })

    // get completed api
    app.get('/todocompleted/:email',async(req,res)=>{
      const email = req.params.email;
      const filter = {email:email}
      const completed = await todoBooking.find(filter).toArray()
      res.send(completed)
      
    })


    app.delete('/todo/:id',async(req,res)=>{
      const id = req.params.id;
      const filterId = {_id:ObjectId(id)}
      const result = await todoBooking.deleteOne(filterId)
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("to-do-app");
});

app.listen(port, () => {
  console.log(`todo app ${port}`);
});
