const {User, Status}=require('./schema.js');
const words=require('an-array-of-english-words');

async function createUser(name){
const user=new User({name});
try{
    await user.save((res)=>{
        console.log("successfully inserted");
    });
}
catch(err){
    console.log(err);
      }
}

async function removeUser(name){
    try{
        const res=await User.deleteOne({name})
    }
  catch(e){console.log(e)}
}

async function getOnlineUsers(){
    try{
       const result= await User.find({})
       return result;
    }
    catch(e){
        console.log(e);
    }

}
async function updateStatus(word,name){

    if(words.indexOf(word.toLowerCase())===-1){
      return 'NOT_DICT_WORD'
       }
        let currWord=word;
    try{
         const status=await Status.findOne({})
           if(status===null) { 
               await Status.create({word:currWord}) 
               return currWord;
              }
        
        //    console.log(status.word===currWord);
            if(status.used.indexOf(currWord)!==-1 || status.word===currWord)    
            return 'USED_WORD';
            
         
           if(status.word.substr(-1)!==currWord.substr(0,1)) 
            return 'INVALID_WORD';
         
            const condition= {'word':status.word}
            const query= {$set:{ word:currWord}, $push:{used:[status.word]}};
 
        await Status.updateOne(condition,query)
        await User.updateOne({'name':name},{$inc:{score:1}})
        return currWord;
         }
        
  
    catch(e){
        console.log(e)
         }

}

async function getCurrentWord(){
    const status=await Status.findOne({});
     if(status!==null)return status.word;
     return '';
}
async function resetGame(){
    try{
        await Status.deleteMany({});
        await User.deleteMany({});
    }
     catch(e){console.log(e)}
}
async function resetScore(name){
    try{
    await User.updateOne({'name':name},{$set:{score:0}});
    await Status.deleteMany({});
    }
    catch(e){
    console.log(e);
    }
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
















  // if(res.nModified===0)
                //  return ("used word");
                //  if(err)console.log(err);