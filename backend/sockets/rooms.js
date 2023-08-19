const socketstore=require('../socketstore')
const {activerooms}=require('../socketstore')


const updaterooms=(tospecificid=null)=>{

const io=socketstore.getsocketserverinstance()
// const activeRooms=activerooms;
if(tospecificid){
    io.to(tospecificid).emit('active-rooms'),{
        activerooms
    }
}else{
    io.emit('active-rooms',{
        activerooms
    })
}
}
module.exports={
    updaterooms
}