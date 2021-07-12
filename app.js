var express=require('express');
var app=express();

var path=require('path');
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+'/Tripee'));


app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

var server=app.listen(process.env.PORT||2000,function(){
    console.log('server is running at 2000 port')
})