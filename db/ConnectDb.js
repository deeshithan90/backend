const mongoose = require('mongoose')

const ConnectionDB = ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log('server connect to mongodb')
        })
    } catch (error) {
        console.error(error)
    }
}

export default ConnectionDB