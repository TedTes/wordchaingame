var socket = io();

const chainForm=document.querySelector('#chain-form');
const onlineList=document.getElementById('online-users');
const timerValue=document.getElementById('timer');
const label=document.getElementById('word');       


let start=true;
chainForm.addEventListener('submit',(e)=>{
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
label.innerText=result;
});


socket.on('onlineUsers',(onlineUsers)=>{
onlineList.innerHTML=onlineUsers.map(user =>`<li><i class="fas fa-user"></i>${user.name}(${user.score})</li>`).join('')

});


function setTimer(timer){
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