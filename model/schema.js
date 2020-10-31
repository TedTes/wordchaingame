const mongoose =require('./db.js').getDb();


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        },
      score:{
        type:Number,
        default:0
           }
})

const statusSchema=new mongoose.Schema({
    currWord:String,
    usedWords:Array
})

const User=mongoose.model("user",userSchema);
const Status=mongoose.model('status',statusSchema);
module.exports={User,Status};
