const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const seed = require('./seed-data');

const user = encodeURIComponent(process.env.MONGO_DB_USERNAME || '');
const pwd = encodeURIComponent(process.env.MONGO_DB_PWD || '');
const host = process.env.MONGO_HOST || 'mongodb'; // the Compose service name
const dbName = process.env.DB_NAME || 'portfolio';
const url = `mongodb://${user}:${pwd}@${host}:27017`;

const app = express();
let db;

// depends_on only waits for the container to start, not for Mongo to be ready,
// so retry for a while instead of crashing.
async function connect() {
  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      const client = new MongoClient(url, { serverSelectionTimeoutMS: 3000 });
      await client.connect();
      return client.db(dbName);
    } catch (err) {
      console.log(`MongoDB not ready (${attempt}/15): ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  throw new Error('Could not connect to MongoDB');
}

async function seedIfEmpty() {
  for (const [name, docs] of Object.entries(seed)) {
    const collection = db.collection(name);
    if ((await collection.countDocuments()) === 0) {
      await collection.insertMany(docs);
      console.log(`Seeded ${docs.length} documents into ${name}`);
    }
  }
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/portfolio', async (req, res) => {
  try {
    const load = (name) =>
      db.collection(name).find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
    const [profile, experience, projects, skills] = await Promise.all([
      load('profile'), load('experience'), load('projects'), load('skills')
    ]);
    res.json({ profile: profile[0] || {}, experience, projects, skills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not read from MongoDB' });
  }
});

(async () => {
  db = await connect();
  await seedIfEmpty();
  app.listen(3000, () => console.log('app listening on port 3000!'));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
