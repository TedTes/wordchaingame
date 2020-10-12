const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://Admin:123@cluster0.xhsd7.mongodb.net/chainGame?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection;
db.once('open',()=>{
    console.log('Db connected');
})
db.on('error',console.error.bind(console,"connection error"))

function getDb(){
    return mongoose;
}

module.exports={getDb}