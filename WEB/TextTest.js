
url = "http://localhost:4000"



function SendMessage(){

    let mess = document.getElementById("Messages").value

    axios({

        method : 'post' ,
        url: url+'/chat',
        data:{
            Text:mess
        }
        
        
    }).then(function(res){


        displayServer(res.data.message.server)
        displayClient(res.data.message.client)
        

        console.log(res.data.message.server)
        
    }).catch(function(err){
        console.log(err)
        
    })
}


function displayServer(data){

    var t = document.getElementById("TServer")
    
    for(var i = 0;i<data.length;i++){

      var mess = document.createElement('h5')
      mess.innerHTML = data[i]
      t.appendChild(mess)

    }

}

function displayClient(data){
    var t = document.getElementById("tClient")
    
    for(var i = 0;i<data.length;i++){

        var mess = document.createElement('h5')
      mess.innerHTML = data[i]
      t.appendChild(mess)

    }

}