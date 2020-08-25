const {createUser,updateStatus,getOnlineUsers,removeUser,getCurrentWord,resetGame,resetScore}=require('../model/crud.js');
const express=require("express");
const http=require('http');
const socket=require('socket.io');
const message=require('../utils/message.js');


const app=express();
const server=http.createServer(app);
const io=socket(server);
 
app.use(express.static('client'));
app.use(express.urlencoded({extended:"false"}));
app.set('views','./client/views');
app.set('view engine','ejs');

const timer=60;

app.get('/',(req,res)=>{
    res.render('index.ejs')
});
app.post('/name',async(req,res)=>{
    const name=req.body.name;
    app.locals.name=name;
const result=await createUser(name);
 if(result._id) res.render('home.ejs',{name:result.name})
});


io.on('connect',async(socket)=>{
const name=app.locals.name;

//display current word for new user
const currword=await getCurrentWord();
if(currword!==null)io.emit('mesg',(currword));

updateOnlineUsers();

socket.on('word',async(word)=>{
io.emit('timer',(timer));
const result=await updateStatus(word,name);
    
//track invalid words
if(message[result]!==undefined){
const msg=message[result]
io.to(socket.id).emit('mesg',(msg))
} 
else {
io.emit('mesg',(result)) 
updateOnlineUsers();
}
});


socket.on('done',async()=>{
const user=await resetScore(name);
  updateOnlineUsers();
  socket.emit('mesg',("Game Over!"));
});

socket.on('disconnect',async()=>{
const user=await removeUser(name);
if(user){
socket.broadcast.emit('mesg',`${user} has left the game`)
}
if(socket.conn.server.clientsCount===0){
await resetGame();
}
});

async function updateOnlineUsers(){
onlineUsers=await getOnlineUsers();
io.emit('onlineUsers',(onlineUsers));
}
});


const PORT=process.env.PORT||3000;
server.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`)
});
