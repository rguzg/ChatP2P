const express = require('express');
const connUsers = require('../config/ConnectedUsers')
const Chat = express.Router();
let ip = ""
let messages = {

    server:[],
    client : []
}

Chat.get("/",(req,res,next)=>{

     ip = req.ip
    console.log(ip)
    return  res.status(200).json({code:200,message:"Connected from "+ip,Users:connUsers})


})

Chat.post("/",(req,res,next)=>{

  
  const {Text} = req.body
  messages.server.push("OK")
  messages.client.push(Text)

  return res.status(201).json({code:201,message:messages,IP:ip})

})

module.exports = Chat