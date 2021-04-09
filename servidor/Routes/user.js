const express = require('express');
const user = express.Router();
const db = require('../config/database')
const jwt = require('jsonwebtoken');
let users = db.usuarios

user.post("/signin", async(req,res,next) =>{
//Se pide el username y la contraseña
    const {user_name,user_password} = req.body

    //Se verifica que se manden todos los datos
    if(user_name&&user_password){
        
        //Verificación de que no exista un usuario con el mismo Username
        if(users.hasOwnProperty(user_name)){

            return res.status(500).json({code:500,message:'Usuario ya existente'})

        }else{
        //Se crea un apartado con el Username y Password utilizando el Username como identificador
        users[user_name] = [user_name,user_password]


    return res.status(200).json({code:200,message:'Usuario Creado Correctamente'})
    }
    }
    else{
        return res.status(200).json({code:200,message:'Campos Incorrectos'})
    }

    

})


user.post("/login",async(req,res,next)=>{

const {user_name,user_password} = req.body

if(user_name&&user_password){

    
    if(users.hasOwnProperty(user_name)){

        if(users[user_name][0]==user_name&&users[user_name][1]==user_password){

        
                const token = jwt.sign({
                    user_name : users[user_name][0],
                    
                }, 'debugkey')
               
               
                return res.status(200).json({code:200,message:token})

            

            }
        else{
            return res.status(401).json({code:401,message:'Login Incorrecto'})
        }

    }
    else{
        return res.status(500).json({code:500,message:'Usuario Inexsitente / Incorrecto'})

    }


}
else{

    return res.status(500).json({code:500,message:'Campos Incorrectos'}) 
}


})




module.exports = user;