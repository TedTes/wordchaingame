const {createUser,updateStatus,getOnlineUsers,removeUser,getCurrentWord,resetGame,resetScore}=require('../model/crud.js');
const express=require("express");
// const http=require('http');
const socket=require('socket.io');
const message=require('../utils/message.js');
const words=require('an-array-of-english-words');


const app=express();
// const server=http.createServer(app);
// const io=socket(server);
const PORT=process.env.PORT||3000;
const server=app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`)
});
io=socket(server);

app.use(express.static('client'));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views','./client/views');


const timer=60;

app.get('/',(req,res)=>{
    res.render('index.ejs')
});
app.post('/name',(req,res)=>{
    const name=req.body.username;
    app.locals.name=name;
const result=createUser(name);
result.then(user=>{
  if(user._id) res.render('home.ejs',{name:user.name})
}).catch(e=>console.log(e));
});


io.on('connect',(socket)=>{
const name=app.locals.name;
getCurrentWord(name).then(currWord=>{
    if(currWord!==null)io.emit('mesg',(currWord));
}).catch(error=>console.log(error));

//update for new user
updateOnlineUsers();

socket.on('word',(word)=>{
io.emit('timer',(timer));
updateStatus(word,name).then(result=>{
//track invalid words
if(message[result]!==undefined){
    const msg=message[result]
    io.to(socket.id).emit('mesg',(msg))
    } 
    else {
    io.emit('mesg',(result)) 
    updateOnlineUsers();
    }
 }).catch(e=>console.log(e));

});


socket.on('done',()=>{
 resetScore(name).catch(e=>console.log(e));
  updateOnlineUsers();
  socket.emit('mesg',("Game Over!"));
});

socket.on('disconnect',()=>{
 removeUser(name).then(user=>{
    if(user){
        socket.broadcast.emit('alert',`${name} has left the game!`)
        updateOnlineUsers();
        }
 })

if(socket.conn.server.clientsCount===0){
resetGame().catch(e=>console.log(e));
}
});

async function updateOnlineUsers(){
getOnlineUsers().then(onlineUsers=>{
    io.emit('onlineUsers',(onlineUsers));
}).catch(e=>console.log(e))
}
});


// const PORT=process.env.PORT||3000;
// const server=app.listen(PORT,()=>{
//     console.log(`server started at port ${port}`)
// });
// io=socket(server);

// server.listen(PORT,()=>{
//     console.log(`server started at port ${PORT}`)
// });
