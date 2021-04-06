
module.exports = (req,res,next)  => {

    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,Access-Control-Request-Method,X-API-KEY")
    
    

    if(req.method === 'OPTIONS'){

        res.header("Access-Control-Allow-Methods"," PUT, POST, PATCH, DELETE, GET, OPTIONS")
        return res.status(200).json({})

    }
    next();
}