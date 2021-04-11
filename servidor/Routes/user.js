const express = require('express');
const user = express.Router();
const db = require('../config/database')
const connUsers = require('../config/ConnectedUsers')
const jwt = require('jsonwebtoken');
let ConnUsers = connUsers.usuariosConectados
let users = db.usuarios;
let assigned_ports = [4000];

const generatePortNumber = () => {
    while(true){
        let port =  Math.floor(Math.random() * (65536 - 50000 + 1) + 50000);

        if(!assigned_ports.includes(port)){
            assigned_ports.push(port);
            return port;
        }
    }
}

user.post("/signin", async(req,res,next) =>{
//Se pide el username y la contraseña
    const {user_name} = req.body

    //Se verifica que se manden todos los datos
    if(user_name){
        
        //Verificación de que no exista un usuario con el mismo Username
        if(users.hasOwnProperty(user_name)){

            return res.status(500).json({code:500,message:'Usuario ya existente'})

        }else{
        //Se crea un apartado con el Username y Password utilizando el Username como identificador
        users[user_name] = [user_name]


    return res.status(200).json({code:200,message:'Usuario Creado Correctamente'})
    }
    }
    else{
        return res.status(200).json({code:200,message:'Campos Incorrectos'})
    }
})


user.post("/login",async(req,res,next)=>{

const {user_name} = req.body

if(user_name){

    //Existencia del usuario 
    if(users.hasOwnProperty(user_name)){

        if(users[user_name][0]==user_name){

                //Creación del JWT
                const token = jwt.sign({
                    user_name : users[user_name][0],
                    port: generatePortNumber()
                }, 'debugkey')
               

                //Se agrega el usuario a la lista de usuarios Conectados.
               ConnUsers[user_name] = [user_name,req.ip]
               
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




module.exports = {user, database: users};