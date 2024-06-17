/*setTimeout(() => {
    console.log("2 saniye timeout")
},2000);
*/
const names = ['Ali','Berk','Canan'];
const shortNames=names.filter((name) => {
    return name.length <= 4;
})

console.log(shortNames);
/*
const geocode = (address,callback) => {
    setTimeout(() => {
        const data= {
            latitude: 0,
            longitude: 0
        }   //senkronsa return asenkronsa callback kullanılır.yoksa undefined geriye döndürür.
        callback(data);
    }, 2000);
           
}
//const data=geocode('Bursa');
geocode('Bursa',(data) => {
 console.log(data);
})
//console.log(data)*/

const add= (a,b,callback) => {
    setTimeout(() => {
        callback(a+b)
    },2000)            //asenkron hale getirmek için setTimeout kullanıyoruz.
}

add(1,4, (sum) => {
    console.log(sum);
})