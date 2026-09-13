const mongoose=require("mongoose")

async function Connectdb(req,res){
try{
await mongoose.connect(process.env.MONGO_URI)

console.log("database Connected")
}catch(error){
    return res.status(500).json({
        success:false,
        message:error.message
    })
}
}


module.exports=Connectdb