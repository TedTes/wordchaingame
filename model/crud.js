const {User, Status}=require('./schema.js');
const words=require('an-array-of-english-words');

async function createUser(name){
     const user=new User({name});
     const res= await user.save();
     return res;
}

async function removeUser(name){
   const res=await User.deleteOne({name})
   return res;
}

async function getOnlineUsers(){
       const result= await User.find({})
       return result;
}
async function updateStatus(word,name){
  
    if(words.indexOf(word.toLowerCase())===-1) return 'INVALID_WORD'
    let currStatus;
         const status=await Status.findOne({})
           if(status===null) { 
            currStatus= await Status.create({currWord:word});
              return currStatus.currWord;
              }
        
         else if(status.usedWords.indexOf(word)!==-1 || status.currWord===word)    
            return 'USED_WORD';
            
         
         else  if(status.currWord.substr(-1)!==word.substr(0,1)) 
            return 'NOT_CHAINED_WORD';
      
        

       
        else{
            const condition= {'currWord':status.currWord}
            const query= {$set:{currWord:word}, $push:{usedWords:status.currWord}};
 
            await Status.updateOne(condition,query)
            await User.updateOne({'name':name},{$inc:{score:1}})
              return word;
        } 
           
         

}

async function getCurrentWord(name){
    const status=await Status.findOne({});
     if(status!==null) return status.currWord;
     let word=words[Math.floor(Math.random()*words.length)];
     return updateStatus(word,name);
}
async function resetGame(){
        await Status.deleteMany({});
        await User.deleteMany({});
}
async function resetScore(name){
    await User.updateOne({'name':name},{$set:{score:0}})
    await Status.deleteMany({})
}


module.exports={
    createUser,
    updateStatus,
    getOnlineUsers,
    removeUser,
    getCurrentWord,
    resetGame,
    resetScore
}






