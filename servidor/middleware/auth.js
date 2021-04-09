const jwt = require("jsonwebtoken")

module.exports = ((req,res,next)=>{
    try {
        console.log(req.headers)
        const token = req.headers.authorization.split(" ")[1]
        console.log(token)

        const decoded = jwt.verify(token,"debugkey")
        req.user = decoded;
        next()

    } catch (error) {

        console.log(error)
        console.log("FALLLA ESTO AHHHHHH")
       return  res.status(401).json({code:401,message:"Permiso DENEGADO "})
    }
})

