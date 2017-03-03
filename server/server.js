const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3001;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var fs = require('fs');
var dl = require('delivery');
var wkhtmltopdf = require('wkhtmltopdf');

app.use(express.static(publicPath));

//save instance of this html on the server!!
app.get('/files', function(request, response){
  var files = fs.readdirSync(__dirname);
  var adds = [];
  files.forEach((file)=>{
    // console.log(file);
    var str = file.substring(file.lastIndexOf('.') + 1).toUpperCase();
    // console.log(str);
    if(str === 'PNG' || str === 'JPG' || str === 'PDF'){
      // console.log(str);
      // console.log(file);
      adds.push(file);
      var filename = file.substring(0, file.lastIndexOf('.'));
      console.log('Filename:', filename);
      console.log('URL REQUEST ID: ', id);
    }
  });
  return response.send(adds);
});
app.get('/:id', function(request, response){
  // console.log(request.params.id);
  // response.send(request.params);
  var id= request.params.id;

  try{
    id = id.replace("#top", "");
    console.log('ID: ', id);
  }catch(e){

  }

  console.log(path.join(__dirname));
  var files = fs.readdirSync(__dirname);
  var adds = [];
  files.forEach((file)=>{
    // console.log(file);

    var str = file.substring(file.lastIndexOf('.') + 1).toUpperCase();
    // console.log(str);
    if(str === 'PNG' || str === 'JPG' || str === 'PDF'){
      // console.log(str);
      // console.log(file);
      adds.push(file);
      var filename = file.substring(0, file.lastIndexOf('.'));
      console.log('Filename:', filename);
      console.log('URL REQUEST ID: ', id);
      if(filename === id){
      console.log('\n\n\nFOUND FILE!!!: ', file);
      return response.download('server/' + file);
      }
      // else{
      //   return response.set('We\'re Sorry, the file you have request either does not exist or has been removed');
      // }
    }
  });
});

io.on('connection', (socket)=>{
  console.log(`\n\nNew User Connected: \n\t(socket.id):${socket.id}`);
  var delivery = dl.listen(socket);
  delivery.on('receive.success', function(file){
    var params = file.params;
    // var buf = file.buffer.toString('binary');
    // socket.emit('image', { image: true, buffer: file.buffer.toString('base64'), params:params});
    console.log(file);
    fs.writeFile(__dirname+'/'+file.name, file.buffer, function(err){
      if(err) console.log('FILE FAILED TO SAVE ONTO SERVER');
      else{
        console.log('FILE SAVED ON SERVER');
      }
    });
    fs.readFile(__dirname + file.name, function(err, buf){
    console.log('\n\nPARAMS: box', params);
    // it's possible to embed binary data
    // within arbitrarily-complex objects
    // socket.emit('image', { image: true, buffer: file.buffer.toString('base64'), params:params});
    console.log('image file is initialized');
  });
  });

  socket.on('pdf', function(params){
    wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

    console.log('wkHTMLtoPDF in progress: ', params);
  });
});




server.listen(port, function(){
  console.log(`Server is up and running on port: ${port}`);
});
