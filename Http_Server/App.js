var http=require("http");
const route=require("./routers");

var server=http.createServer(route);
server.listen(322,()=> {console.log("istek yapildi.")});
