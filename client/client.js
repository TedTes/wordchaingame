var socket = io();
// const chainForm=document.querySelector('#chain-form');
// const onlineList=document.getElementById('online-users');
// const timerValue=document.getElementById('timer');
// const label=document.getElementById('word');    
// const alertMsg=document.querySelector('#alert-msg');

 function Facade(){}
  Facade.prototype.getElement=function(selector){
    return  document.querySelector(selector);
 }
 const facade=new Facade();
let start=true;

facade.getElement('#chain-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const word=e.target.inputWord.value;
    socket.emit("word",(word));
    e.target.inputWord.value='';
});

socket.on('timer',(timer)=>{
    if(start){
        start=false;
        setTimer(timer);
    }
});

socket.on('mesg',(result)=>{
facade.getElement('#word').innerText=result;
});


socket.on('onlineUsers',(onlineUsers)=>{
facade.getElement('#online-users').innerHTML=onlineUsers.map(user =>`<li><i class="fas fa-user"></i>${user.name}(${user.score})</li>`).join('')

});

socket.on('alert',(msg)=>{
    const alertMsg= facade.getElement('#alert-msg')
  alertMsg.innerText=msg;
  setTimeout(()=>alertMsg.innerText='',4000);
})
function setTimer(timer){
    const timerValue=facade.getElement('#timer')
     const interval= setInterval(()=>{
            timerValue.style.visibility="unset";
            timerValue.innerText=timer;
            timer=timer-1;
            
             if(timer===0){
            clearInterval(interval)
            socket.emit('done');
            start=true;
            timerValue.style.visibility="hidden";
            }
            },1000);
}