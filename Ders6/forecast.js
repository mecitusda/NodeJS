const request = require('postman-request')

const forecast = (longitude,latitude,callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=4bb99daa4a9d94b118f15ec267fe3980&query='+longitude+','+latitude+'&units=f'
    console.log(url)
    request({url:url, json:true},(error,response) => {
        
        if(error){                                                                     
            callback("Hava durumu servisine bağlantı kurulamadı",(undefined))          
                                                                                      
        }                                                                            
        else if(response.body.error){
           // console.log("hata : "+response.body.error)                                               
            callback('Belirttiğiniz konum bilgisi bulunamadı',undefined)
                     //
        }                                                                         
        else{                                                                    
                                                        
            callback(undefined,{hissedilen:response.body.current.feelslike,nem:response.body.current.humidity,havadurumu:response.body.current.weather_descriptions})
            
        }
    
    })
}
module.exports = forecast




