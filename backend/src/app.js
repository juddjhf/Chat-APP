const express=require("express")
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors=require("cors")

const app=express()
app.use(express.json())
app.use(cors())

app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);

module.exports=app