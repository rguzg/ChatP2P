
const express = require("express");
const app = express();
//Routers
const chat = require('./Routes/chat');



//Middleware separation 

const notFound = require("./middleware/notFound")

const cors = require("./middleware/cors")

app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: true} ));


app.use("/chat",chat)




app.use(notFound)


app.listen(process.env.PORT ||4000,()=>{

    console.log("Server is Running...")
})
