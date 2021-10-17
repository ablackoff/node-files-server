import express from 'express';
import multer  from 'multer';
import path from 'path';

const __dirname = path.resolve();
const app = express();

function mimeTypesFilter(mimeTypes) {
  return function(req, file, cb) {
    if (mimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File mime type error'));
    }
  };
}

const storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname);
	}
});

const mimeTypes = ['audio/mp3', 'audio/acc', 'audio/mpeg', 'audio/wav'];

const upload = multer({
	storage : storage,
  fileFilter: mimeTypesFilter(mimeTypes)
}).any();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/',function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.post('/api/music',function(req, res) {
	upload(req,res,function(err) {
		if(err) {
			return res.end(`Error uploading file.`);
		}
		res.end("File is uploaded");
	});
});

app.listen(9000,function() {
	console.log(
		"Working on port 9000\n" +
		"Click here to open the link: http://localhost:9000"
	);
});