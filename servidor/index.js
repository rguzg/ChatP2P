
const express = require("express");
const app = express();
//Routers
const chat = require('./Routes/chat');
const user = require('./Routes/user');


//Middleware separation 

const notFound = require("./middleware/notFound")
const auth = require("./middleware/auth")
const cors = require("./middleware/cors")

app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: true} ));

app.use("/user",user)
app.use(auth)
app.use("/chat",chat)




app.use(notFound)


app.listen(process.env.PORT ||4000,()=>{

    console.log("Server is Running...")
})
