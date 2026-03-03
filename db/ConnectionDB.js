// db/ConnectionDB.js
const mongoose = require('mongoose');

const MongoDBConnect = async () => {
   mongoose.connect(process.env.MONGO_URI)
   .then(()=>{
    console.log('MongoDB connect sucess')
   })
   .catch((err)=>{
    console.log(err)
   })
};

module.exports = MongoDBConnect;