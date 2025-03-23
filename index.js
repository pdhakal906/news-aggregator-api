const express = require('express');
const { MongoClient } = require("mongodb");

const connectionString = process.env.ATLAS_URI || "mongodb+srv://pdhakal906:FTZyXxB4nsHR4a8s@cluster0.vptj4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(connectionString);

async function main() {
  try {
    const conn = await client.connect();
    console.log("Connected to MongoDB!");

    const db = conn.db("news_data");
    const collectionName = "news_collection";
    const collection = db.collection(collectionName);

    const news = [
      {
        "title": "नेपाल बिल्डकन अन्तर्राष्ट्रिय प्रदर्शनी आजदेखि",
        "image_url": "https://assets-cdn-api.ekantipur.com/thumb.php?src=https://assets-cdn.ekantipur.com/uploads/source/news/kantipur/2025/third-party/biuldcon-expo-2-2022025031724.gif&w=1001&h=0",
        "link": "https://ekantipur.com/business/2025/02/20/nepal-buildcon-international-exhibition-from-today-02-58.html",
        "source": "ekantipur"
      }
    ];

    // try {
    //   const insertManyResult = await collection.insertMany(news);
    //   console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
    // } catch (err) {
    //   console.error(`Error inserting documents: ${err}\n`);
    // }

    const app = express();
    const port = 3000;

    // Middleware to parse JSON bodies
    app.use(express.json());

    app.get('/', async (req, res) => {
      try {
        const newsList = await collection.find({}).toArray(); // Get all documents
        res.json(newsList); // Send response as JSON
      } catch (err) {
        console.error("Error fetching news:", err);
        res.status(500).json({ error: "Failed to fetch news" });
      }
    });

    app.post('/', async (req, res) => {
      console.log("Received POST request");
      console.log("Request body:", req.body);
      try {
        const newNews = req.body; // Assuming you send the new news data in the request body

        const insertResult = await collection.insertOne(newNews);
        res.json(insertResult);
      } catch (err) {
        console.error("Error inserting news:", err);
        res.status(500).json({ error: "Failed to insert news" });
      }
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

  } catch (e) {
    console.error("MongoDB connection error:", e);
  }
}

main();
