

const r=(request,response) => {  //Bu sayfadaki fonksiyona başka sayfalarda yer kaplamadan kullanmak için buraya attık ve altta export ettik.


    //console.log(request.url,request.method)
    //   console.log(response.statusCode)
   /* response.setHeader("Content-Type","text/html");
   
    response.statusMessage="Hosgeldin!"
    response.write("<h1>Hosgeldiniz!<h1>")//html kodu yazabiliriz.
    response.write("<h2>Filmler<br></h2>")
    response.write("<p>Zodiac<br></p>")
    response.write("<p>Fight Club!</p>")
    response.write("<p>John Wick</p>")
    response.write("<p>Zodiac</p>")*/
    var fs=require("fs");
   if(request.url=='/'){
       
       fs.readFile("Anasayfa.html",(error,html) => {
           response.writeHead(200,{"Content-Type":"text/html"})
           response.write(html)
           response.end();
       })
   }
   
   else if(request.url == "/Filmler"){
       fs.readFile("Filmler.html",(error,html) => {
           response.writeHead(200,{"Content-Type":"text/html"})
           response.write(html)
           response.end();
       })
   }
   else if(request.url == "/Create" && request.method == "POST"){
       const data=[];
       request.on("data",(chunk) => {
           data.push(chunk);
       
       });    
           
       request.on("end",() => {
           const result=Buffer.concat(data).toString();
           const parsedData=result.split("=")[1];
           console.log(parsedData);
           fs.appendFile("Girdiler.txt",parsedData+"\n",(error)=>{
               if(error){
                   console.log(error);
               }
               else{
                   response.statusCode=302;
                   response.setHeader("Location","/")
                   response.end();
               }
               
            })
       })
   
   
       
       
   }
   else if(request.url == '/Create'){
    
       fs.readFile("Create.html",(error,html) => {
           response.writeHead(200,{"Content-Type":"text/html"})
           response.write(html)
           response.end();
       })
   }
   else {
       fs.readFile("error404.html",(error,html) => {
           response.writeHead(200,{"Content-Type":"text/html"})
           response.write(html)
           response.end();
       })
   }
   
   
       
   }
   module.exports=r;