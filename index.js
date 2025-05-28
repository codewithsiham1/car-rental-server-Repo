// const express = require('express');
// const cors = require('cors');
// const app=express();
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const port=process.env.PORT||5000;
// const { ObjectId } = require('mongodb');
// app.use(cors());
// app.use(express.json())
// require("dotenv").config();
// // DB_USER=rental-cars
// // DB_PASS=UDkhSbGlZi0GwxGV


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.07o5c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     // car related apis
//     const carCollection=client.db("car-Rentals").collection("cars");
//     const bookingsCollection = client.db("car-Rentals").collection("bookings");
//     // app.get("/cars",async(req,res)=>{
//     //     const cursor=carCollection.find();
//     //     const result=await cursor.toArray();
//     //     console.log(result); 
//     //     res.send(result);
//     // })
//     // app.get("/recent-cars", async (req, res) => {
//     //     try {
//     //       const cursor = carCollection.find().sort({ _id: -1 }).limit(6); // most recent
//     //       const cars = await cursor.toArray();
      
//     //       const formattedCars = cars.map(car => ({
//     //         image: car.image,
//     //         model: car.model,
//     //         price: parseInt(car.daily_price.replace(/\D/g, '')), // "$45/day" -> 45
//     //         is_available: car.available,
//     //         booking_count: car.booking_count,
//     //         date_posted: `Added ${car.date_posted}` // already contains "2 days ago"
//     //       }));
      
//     //       res.send(formattedCars);
//     //     } catch (error) {
//     //       console.error("Error fetching recent cars:", error);
//     //       res.status(500).send({ error: "Failed to fetch recent cars" });
//     //     }
//     //   });
//     // 
//     app.get("/recent-cars", async (req, res) => {
//       try {
//         const cursor = carCollection.find().sort({ _id: -1 }).limit(6);
//         const cars = await cursor.toArray();
    
//         console.log("Raw cars:", cars);
    
//         const formattedCars = cars.map(car => {
//           try {
//             return {
//               image: car.image || "",
//               model: car.model || "Unknown Model",
//               price: car.daily_price
//                 ? parseInt(car.daily_price.replace(/\D/g, '')) || 0
//                 : 0,
//               is_available: car.available || false,
//               booking_count: car.booking_count || 0,
//               date_posted: car.date_posted ? `Added ${car.date_posted}` : "Added date unknown"
//             };
//           } catch (error) {
//             console.error("Error formatting car:", car, error);
//             return null;
//           }
//         }).filter(Boolean);
    
//         res.send(formattedCars);
//       } catch (error) {
//         console.error("Error fetching recent cars:", error);
//         res.status(500).send({ error: "Failed to fetch recent cars" });
//       }
//     });
    
//       // 
//       app.post("/cars", async (req, res) => {
//         try {
//           const newCar = req.body; // ফ্রন্টএন্ড থেকে পাঠানো ডেটা
//           const result = await carCollection.insertOne(newCar);
//           res.send(result);
//         } catch (error) {
//           console.error("Failed to add car:", error);
//           res.status(500).send({ error: "Car insertion failed" });
//         }
//       });
//       // 
//       // GET cars by user email
// app.get("/cars", async (req, res) => {
//   const email = req.query.email;
//   const sort = req.query.sort || "newest";

//   let sortOption = { dateAdded: -1 }; // Newest first
//   if (sort === "oldest") sortOption = { dateAdded: 1 };
//   if (sort === "price_low") sortOption = { price: 1 };
//   if (sort === "price_high") sortOption = { price: -1 };

//   try {
//     const result = await carCollection
//       .find({ ownerEmail: email })
//       .sort(sortOption)
//       .toArray();
//     res.send(result);
//   } catch (error) {
//     console.error("Error fetching user cars:", error);
//     res.status(500).send({ error: "Failed to fetch user cars" });
//   }
// });

// // PUT (Update car)
// app.put("/cars/:id", async (req, res) => {
//   const id = req.params.id;
//   const updatedData = req.body;
//   try {
//     const result = await carCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: updatedData }
//     );
//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ error: "Failed to update car" });
//   }
// });

// // DELETE car
// app.delete("/cars/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await carCollection.deleteOne({ _id: new ObjectId(id) });
//     res.send(result);
//   } catch (error) {
//     res.status(500).send({ error: "Failed to delete car" });
//   }
// });
// // 
// app.get('/cars/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     const car = await carCollection.findOne({ _id: new ObjectId(id) });
//     if (!car) return res.status(404).send({ message: "Car not found" });
//     res.send(car);
//   } catch (error) {
//     console.error("Error fetching car by ID:", error);
//     res.status(500).send({ error: "Internal server error" });
//   }
// });

// app.get('/bookings', async (req, res) => {
//   const email = req.query.email; // Optional: তুমি চাইলে email filter দিতে পারো
//   let query = {};
//   if (email) {
//     query.email = email;
//   }

//   try {
//     const bookings = await bookingsCollection.find(query).toArray();
//     res.send(bookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).send({ error: "Failed to fetch bookings" });
//   }
// });
// app.post("/bookings", async (req, res) => {
//   const booking = req.body;
//   try {
//     const result = await bookingsCollection.insertOne(booking);
//     res.status(201).send(result);
//   } catch (error) {
//     console.error("Booking insertion failed:", error);
//     res.status(500).send({ error: "Failed to create booking" });
//   }
// });
// // 
      
//   } finally {
    
    
//   }
// }
// run().catch(console.dir);

// app.get("/",(req,res)=>{
//     res.send('job is falling form the sky')
// })
// app.listen(port,()=>{
//     console.log(`job is waiting at:${port}`)
// })


// backend/index.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.07o5c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");

    const carCollection = client.db("car-Rentals").collection("cars");
    const bookingsCollection = client.db("car-Rentals").collection("bookings");

    // ✅ Get ALL cars (for Available Cars page)
    app.get("/all-cars", async (req, res) => {
      const sort = req.query.sort || "newest";

      let sortOption = { dateAdded: -1 };
      if (sort === "oldest") sortOption = { dateAdded: 1 };
      if (sort === "price_low") sortOption = { price: 1 };
      if (sort === "price_high") sortOption = { price: -1 };

      try {
        const result = await carCollection.find().sort(sortOption).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).send({ error: "Failed to fetch cars" });
      }
    });

    // ✅ Get cars by owner email (My Cars page)
    app.get("/cars", async (req, res) => {
      const email = req.query.email;
      const sort = req.query.sort || "newest";

      let sortOption = { dateAdded: -1 };
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

    // ✅ Add a car
    app.post("/cars", async (req, res) => {
      try {
        const newCar = req.body;
        newCar.dateAdded = new Date().toISOString(); // Add date
        newCar.booking_count = 0;
        const result = await carCollection.insertOne(newCar);
        res.send(result);
      } catch (error) {
        console.error("Failed to add car:", error);
        res.status(500).send({ error: "Car insertion failed" });
      }
    });
   // Add a car
app.post("/cars", async (req, res) => {
  try {
    const newCar = req.body;

    // Normalize is_available to boolean (true if boolean true or string "true")
    newCar.is_available = newCar.is_available === true || newCar.is_available === "true";

    newCar.dateAdded = new Date().toISOString();
    newCar.booking_count = 0;

    const result = await carCollection.insertOne(newCar);
    res.send(result);
  } catch (error) {
    console.error("Failed to add car:", error);
    res.status(500).send({ error: "Car insertion failed" });
  }
});

    // ✅ Get car by ID
    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      try {
        const car = await carCollection.findOne({ _id: new ObjectId(id) });
        if (!car) return res.status(404).send({ message: "Car not found" });
        res.send(car);
      } catch (error) {
        res.status(500).send({ error: "Internal server error" });
      }
    });

    // ✅ Update car
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

    // ✅ Delete car
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await carCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to delete car" });
      }
    });

    // ✅ Get bookings (optional email filter)
    app.get('/bookings', async (req, res) => {
      const email = req.query.email;
      const query = email ? { email } : {};
      try {
        const bookings = await bookingsCollection.find(query).toArray();
        res.send(bookings);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch bookings" });
      }
    });
    // ... your existing code

// Add this inside your async run() function after connecting to DB

app.get("/recent-cars", async (req, res) => {
  try {
    const recentCars = await carCollection
      .find()
      .sort({ dateAdded: -1 }) // Newest first
      .limit(6)                // Limit to 6 recent listings
      .toArray();
    res.send(recentCars);
  } catch (error) {
    console.error("Error fetching recent cars:", error);
    res.status(500).send({ error: "Failed to fetch recent cars" });
  }
});

// ... rest of your code


    // ✅ Create a booking
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      try {
        const result = await bookingsCollection.insertOne(booking);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to create booking" });
      }
    });

  } finally {
    // Not closing the client because we want persistent connection
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("🚗 Car rental server is running!");
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
