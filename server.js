var express =   require("express");
var multer  =   require('multer');
var app         =   express();
var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname);
	}
});
var upload = multer({ storage : storage}).any();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/',function(req,res){
	res.sendFile(__dirname + "/index.html");
});

app.post('/api/music',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end(`Error uploading file. ${err}`);
		}
		console.log(req, res);
		res.end("File is uploaded");
	});
});

app.listen(9000,function(){
	console.log("Working on port 9000");
});