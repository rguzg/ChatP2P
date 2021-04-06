

url = "http://localhost:4000"


function ipFind(){

    axios({

        method : 'get' ,
        url: url+'/chat'
        
        
    }).then(function(res){

        

        console.log(res.data.message)
        window.location = "TextTest.html"
    }).catch(function(err){
        console.log(err)
        
    })


 }


