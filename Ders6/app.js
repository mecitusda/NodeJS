const request = require('postman-request')
//const callback=require('./utils/geocode');
const geocode = require('./geocode');
const forecast=require('./forecast')
const address=process.argv[2] //adres bilgim. node app.js biradres yazınca o adresi direk gösteriyor.
if(!address){
    console.log("Adres bilgisini parametre olarak veriniz.")
}

else{
    console.log('adress:'+address)
    
geocode(address,(error,data) => {
    
    if(error){
        return console.log('Hata1:',error);
    }
    console.log(data)
    forecast(data.longitude,data.latitude,(error,forecastdata) => {
        if(error){
            return console.log('Hata2: ',error);
        }
        console.log(data.location)
        console.log(forecastdata)
    })
})


}
