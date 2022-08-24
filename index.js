const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqvomi1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    client.connect();
    const itemCollection = client.db('items-crud').collection('items');

    app.put('/item/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const itemInfo = req.body;
      const { itemType, itemName, subCategory, unitName, stockLimit } = itemInfo;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          itemType,
          itemName,
          subCategory,
          unitName,
          stockLimit
        }
      };
      const result = await itemCollection.updateOne(filter, updateDoc, options);
      res.send({ result });
    });

    app.get('/item', async (req, res) => {
      const items = await itemCollection.find().toArray();
      res.send(items);
    })

    app.post('/item', async (req, res) => {
      const itemInfo = req.body;
      console.log(itemInfo)
      const result = await itemCollection.insertOne(itemInfo);
      res.send(result);
    });

    app.delete('/item/:id', async (req, res) => {
      const id = req.params.id;
      console.log('delete', id)
      const result = await itemCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    })






  }
  finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Startedddfdf');
});

app.listen(port, () => console.log('Listening to Server at', port));