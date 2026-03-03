// db/ConnectionDB.js
const mongoose = require('mongoose');

let cached = global.mongoose; // check if we have a cached connection

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const MongoDBConnect = async () => {
  if (cached.conn) {
    return cached.conn; // reuse cached connection
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(mongoose => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = MongoDBConnect;