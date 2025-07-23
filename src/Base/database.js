import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB || "botdb";

const client = new MongoClient(uri);
let db;

export async function connect() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}
