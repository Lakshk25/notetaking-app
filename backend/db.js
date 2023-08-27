const mongoose  = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/notebook");

// const connectToMongo = () =>{
//     if(mongoose.connect(mongoURL)){
//         console.log("mongo connected");
//     }
// }

// module.exports = connectToMongo;