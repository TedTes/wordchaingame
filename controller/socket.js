const io=require('./app.js')
console.log("from socket")
console.log(io);
function playGame(name,io){

currIo.on('connection',(socket)=>{
    socket.emit('userConnected',({name}));
    // console.log(`${name} has joned the game`)

    socket.on('word',({word})=>{
        console.log("from socket")
        console.log(word)
    })
})
}
module.exports={playGame}              
