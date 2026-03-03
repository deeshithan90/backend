const mongoose = require("mongoose");

const MongoDBConnect = () => {
   try {
    mongoose.connect(process.env.MONGO_URL)
   .then(()=>{
    console.log('MongoDB connect sucessfully')
   })
   } catch (error) {
      console.log(error)
   } 
}; 

module.exports = MongoDBConnect;