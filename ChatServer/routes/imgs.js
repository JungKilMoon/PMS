var express = require('express');
var oracledb = require('oracledb');
var fs = require('fs');
var router = express.Router();
var format = require('date-format');
var dbConfig = require('../public/config/dbconfig.js');
var connAttrs = {
	user          : dbConfig.user,
	password      : dbConfig.password,
	connectString : dbConfig.url
} 

// 단일드래그 이미지메시지 전송 사진보기
router.get('/imgView/:fileName/:roomNo',function(req,res){
	console.log('imageView/');
	var fn = req.params.fileName;
	var rn = req.params.roomNo;
	console.log('다운받는 파일 : %s',fn);
	var downFile = '../PMS/public/files/room'+rn+'/'+ fn;
	console.log(downFile);
	fs.readFile(downFile,function(error,data){
		if(error) {
			console.log(error.message);
		}
		res.writeHead(200,{'Content-Type' : 'text/html'});
		res.end(data);
	});
});

// 단일드래그 이미지전송 크게보기
router.get('/imgOpen/:fileName/:roomNo',function(req,res){
	var fn = req.params.fileName;
	var rn = req.params.roomNo;
	res.setHeader('Content-Type','text/html');
	res.render('imgOpen', { 
		title: '이미지 크게 보기',
		fn : fn,
		rn : rn
	});
});

//회원의 아이콘보기
router.get('/userIcon/:id',function(req,res){
	var id = req.params.id;
	console.log('imgs : %s',id);
	fs.readFile('../PMS/public/images/userIcon/img_'+id+'.jpg',function(error,data){
		if(error) {
			console.log(' 이미지가 없습니다.');
			console.log(error.message);			
			fs.readFile('../PMS/public/images/userIcon/noimage.png',function(error,data){
				if(error) {
					console.log(error.message);
				}
				res.writeHead(200,{'Content-Type' : 'text/html'});
				res.end(data);
			});
		}else{
			res.writeHead(200,{'Content-Type' : 'text/html'});
			res.end(data);
		}

	});
});

//회의실 사진보기
router.get('/roomImg/:agencyNo/:fileName',function(req,res){
	var id = req.params.agencyNo;
	var fileName = req.params.fileName;
	
	console.log('imgs : %s',id);
	console.log('imgs : %s',fileName);
	fs.readFile('../PMS/public/images/roomImages/'+id+fileName,function(error,data){
		if(error) {
			console.log(' 이미지가 없습니다.');
			console.log(error.message);			
			fs.readFile('../PMS/public/images/roomImages/noimage.jpg',function(error,data){
				if(error) {
					console.log(error.message);
				}
				res.writeHead(200,{'Content-Type' : 'text/html'});
				res.end(data);
			});
		}else{
			res.writeHead(200,{'Content-Type' : 'text/html'});
			res.end(data);
		}

	});
});

//이모티콘 png용
router.get('/icons/:id',function(req,res){
	var id = req.params.id;
	fs.readFile('../PMS/public/images/talkImages/'+id+'.png',function(error,data){
		if(error) {
			console.log(error.message);
			return;
		}
		res.writeHead(200,{'Content-Type' : 'text/html'});
		res.end(data);
	});
});
//이모티콘 gif용
router.get('/gicons/:id',function(req,res){
	var id = req.params.id;
	fs.readFile('../PMS/public/images/talkImages/'+id+'.gif',function(error,data){
		if(error) {
			console.log(error.message);
			return;
		}
		res.writeHead(200,{'Content-Type' : 'text/html'});
		res.end(data);
	});
});

router.get('/slide/:id',function(req,res){
	var id = req.params.id;
	fs.readFile('../PMS/public/images/slideImages/'+id,function(error,data){
		if(error) {
			console.log(error.message);
			return;
		}
		res.writeHead(200,{'Content-Type' : 'text/html'});
		res.end(data);
	});
});

//mainImages폴더
router.get('/m/:imgNm',function(req,res){
	var imgNm = req.params.imgNm;
	fs.readFile('../PMS/public/images/mainImages/'+imgNm,function(error,data){
		if(error) {
			console.log(error.message);
			return;
		}
		res.writeHead(200,{'Content-Type' : 'text/html'});
		console.log('dayimg');
		res.end(data);
	});
});

//talkImages폴더
router.get('/t/:imgNm',function(req,res){
	var imgNm = req.params.imgNm; 
	fs.readFile('../PMS/public/images/talkImages/'+imgNm,function(error,data){
		if(error) {
			console.log(error.message);
			return;
		}
		res.writeHead(200,{'Content-Type' : 'text/html'});
		res.end(data);
	});
});


module.exports = router; 