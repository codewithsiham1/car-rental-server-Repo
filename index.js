const express = require('express');
const cors = require('cors');
const app=express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port=process.env.PORT||5000;
app.use(cors());
app.use(express.json())
require("dotenv").config();
// DB_USER=rental-cars
// DB_PASS=UDkhSbGlZi0GwxGV


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.07o5c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // car related apis
    const carCollection=client.db("car-Rentals").collection("cars");
    // app.get("/cars",async(req,res)=>{
    //     const cursor=carCollection.find();
    //     const result=await cursor.toArray();
    //     console.log(result); 
    //     res.send(result);
    // })
    // app.get("/recent-cars", async (req, res) => {
    //     try {
    //       const cursor = carCollection.find().sort({ _id: -1 }).limit(6); // most recent
    //       const cars = await cursor.toArray();
      
    //       const formattedCars = cars.map(car => ({
    //         image: car.image,
    //         model: car.model,
    //         price: parseInt(car.daily_price.replace(/\D/g, '')), // "$45/day" -> 45
    //         is_available: car.available,
    //         booking_count: car.booking_count,
    //         date_posted: `Added ${car.date_posted}` // already contains "2 days ago"
    //       }));
      
    //       res.send(formattedCars);
    //     } catch (error) {
    //       console.error("Error fetching recent cars:", error);
    //       res.status(500).send({ error: "Failed to fetch recent cars" });
    //     }
    //   });
    // 
    app.get("/recent-cars", async (req, res) => {
      try {
        const cursor = carCollection.find().sort({ _id: -1 }).limit(6);
        const cars = await cursor.toArray();
    
        console.log("Raw cars:", cars);
    
        const formattedCars = cars.map(car => {
          try {
            return {
              image: car.image || "",
              model: car.model || "Unknown Model",
              price: car.daily_price
                ? parseInt(car.daily_price.replace(/\D/g, '')) || 0
                : 0,
              is_available: car.available || false,
              booking_count: car.booking_count || 0,
              date_posted: car.date_posted ? `Added ${car.date_posted}` : "Added date unknown"
            };
          } catch (error) {
            console.error("Error formatting car:", car, error);
            return null;
          }
        }).filter(Boolean);
    
        res.send(formattedCars);
      } catch (error) {
        console.error("Error fetching recent cars:", error);
        res.status(500).send({ error: "Failed to fetch recent cars" });
      }
    });
    
      // 
      app.post("/cars", async (req, res) => {
        try {
          const newCar = req.body; // ফ্রন্টএন্ড থেকে পাঠানো ডেটা
          const result = await carCollection.insertOne(newCar);
          res.send(result);
        } catch (error) {
          console.error("Failed to add car:", error);
          res.status(500).send({ error: "Car insertion failed" });
        }
      });
      // 
      // GET cars by user email
app.get("/cars", async (req, res) => {
  const email = req.query.email;
  const sort = req.query.sort || "newest";

  let sortOption = { dateAdded: -1 }; // Newest first
  if (sort === "oldest") sortOption = { dateAdded: 1 };
  if (sort === "price_low") sortOption = { price: 1 };
  if (sort === "price_high") sortOption = { price: -1 };

  try {
    const result = await carCollection
      .find({ ownerEmail: email })
      .sort(sortOption)
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching user cars:", error);
    res.status(500).send({ error: "Failed to fetch user cars" });
  }
});

// PUT (Update car)
app.put("/cars/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const result = await carCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to update car" });
  }
});

// DELETE car
app.delete("/cars/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await carCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete car" });
  }
});

      
  } finally {
    
    
  }
}
run().catch(console.dir);

app.get("/",(req,res)=>{
    res.send('job is falling form the sky')
})
app.listen(port,()=>{
    console.log(`job is waiting at:${port}`)
})