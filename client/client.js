var socket = io();
const chainForm=document.querySelector('#chain-form');
const onlineList=document.getElementById('online-users');
const timerValue=document.getElementById('timer');
const label=document.getElementById('word');
const inputWord=document.querySelector('#input-word');
const score=document.querySelector('#score');

let start=true;
socket.on('userConnected',()=>{
    chainForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const word=e.target.elements.inputWord.value;
    e.target.elements.inputWord.value='';
    socket.emit("word",(word));
 
}); });
socket.on('timer',(timer)=>{
    if(start){
        start=false;
        setTimer(timer);
    }
});
socket.on('mesg',(result)=>{
label.innerText=result;
});
socket.on('currword',(currword)=>{
    label.innerText=currword || ' ';
});
socket.on('invalid',(msg)=>{
    label.innerText=msg;
});
socket.on('onlineUsers',(onlineUsers)=>{
onlineList.innerHTML=onlineUsers.map(user =>`<li><i class="fas fa-user"></i>&nbsp${user.name}&nbsp<span id="score">(${user.score})</span>&nbsp&nbsp</li>`)
});


function setTimer(timer){
     const interval= setInterval(()=>{
            timerValue.style.visibility="unset";
            timer=timer-1;
            timerValue.value=timer;
            if(timer===0){
            clearInterval(interval)
            socket.emit('done');
            start=true;
            timerValue.style.visibility="hidden";
            }
            },1000);
}