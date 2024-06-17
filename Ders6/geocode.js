const request = require('postman-request')





const geocode = ((address,callback) => { 
    
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?access_token=pk.eyJ1IjoibWlyYWN1c2RhIiwiYSI6ImNsdWJyNWNvZjBlN3gybXA5bjh4d2VyeWEifQ.f8-G_RFHMZdI6LPt7DSq3Q'


    request({url:url, json:true},(error,response) => {
        if(error){       
            console.log(""+error)                                                       //ders 6
            callback("servise bağlanamadı",(undefined))   
                                 //
        }                                                                     //
        else if(response.body.features.length===0){      
                         //
            callback('Belirttiğiniz konum bulunamadı',undefined)            //
        }                                                                  //  
        else{
            
            callback(undefined,{longitude:response.body.features[0].center[0],latitude:response.body.features[0].center[1],location:response.body.features[0].place_name})
        }
    
    })
})

   module.exports=geocode


