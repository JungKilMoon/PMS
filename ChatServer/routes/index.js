var express = require('express');
var fs = require('fs');
var router = express.Router();
var format = require('date-format');
var multiparty = require('multiparty');http://192.168.201.18:3000/slide#
var fileUpload = require('express-fileupload');
var sQuery = require('../query/spread.js');


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/* GET home page. */
router.get('/', function(req, res, next) {
	res.setHeader('Content-Type','text/html');
	res.render('index', { title: 'Node Js Server Open !!   By AMUMU'});  
});

router.post('/slideWrite', function(req, res, next) {
	var proNo = req.body.proNoS;
	var loginId = req.body.mem_idS;
	var loginName = req.body.mem_nameS;
	console.log(loginId);
	var nextCnt;
	var mode;	
  
	console.log('slideWrite => proNo : ',proNo);
	res.setHeader('Content-Type','text/html');  
	res.render('slideWrite', { title: 'ClassDo 작성하기',proNo:proNo,mem_id:loginId,mem_name:loginName,mode:'write',docNo:0,fileName:0 });
});

router.post('/slideEdit', function(req, res, next) {
	var proNo = req.body.proNoS;
	var loginId = req.body.mem_idS;
	var loginName = req.body.mem_nameS;
	var docNo = req.body.docNoS;
	var fileName = req.body.fileNameS;
	var title = req.body.titleS;
	console.log(loginId);
	var nextCnt;
	var mode;	
  
	console.log('slideEdit => proNo : ',proNo);
	console.log('slideEdit => fileName : ',fileName);
	res.setHeader('Content-Type','text/html');  
	res.render('slideWrite', { title: 'ClassDo 작성하기',proNo:proNo,mem_id:loginId,mem_name:loginName,mode:'edit',fileName:fileName,docNo:docNo,title:title });
});

router.post('/nextCnt', function(req, res, next) {
	sQuery.nextCnt(function(err,result){
		if(err){
			console.log(err);
			return;
		}else{
			if(result.length>0){
				res.json({result:result[0].NEXTVAL});
			}else{
				res.json({result:0});
			}
			
		}
	});
});



router.post('/createSlide', function(req, res, next) {
	var data = req.body.data;
	var dataText = JSON.stringify(data);
	var d = JSON.parse(req.body.data2);
	console.log(d);
	console.log(d.title);
	console.log(d.mem_id);
	
	
	var fileName ="PMS_"+d.proNo+'_'+d.docNo+'_'+d.title+".do";
	var filePath = "../PMS/public/files/slide/"+fileName;
	var f = {docNo:d.docNo,title:d.title,fileName:fileName,id:d.mem_id,proNo:d.proNo};
	console.log(f);
	fs.writeFile(filePath, dataText, (err) => {  
		if (err) {			
			res.json({result:err});
		}
	});
	
	sQuery.checkSlide(f,function(err,result){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('------------------------');
			console.log(result);
			console.log(result.CNT);
			console.log('------------------------');
			if(result[0].CNT>0){
				console.log('이미있으니 수정!');	
				sQuery.updateSlide(f,function(err,cnt){
					if(err){
						console.log(err);
						return;
					}else{
						if(cnt>0){
							console.log('수정성공!');
							res.json({result:cnt});			
						}else{
							res.json({result:cnt});
						}

					}
				});
			}else{
				console.log('없으니 추가!');						
				sQuery.insertSlide(f,function(err,cnt){
					if(err){
						console.log(err);
						return;
					}else{
						if(cnt>0){
							console.log('등록성공!');
							res.json({result:cnt});			
						}else{
							res.json({result:cnt});
						}

					}
				});
			}

		}
	});
});

router.post('/openSlide',function(req, res, next) {
	console.log('openSlide');
	var fileNm = req.body.fileNm;
	console.log(fileNm);
	fs.readFile('../PMS/public/files/slide/'+fileNm,function(error,data){
		if(error) {
			console.log(error.message);
			res.end(error.message);				
		}else{
			console.log('openSlide 읽기성공');
			console.log(data);
			res.writeHead(200,{'Content-Type' : 'text/html'});
			res.end(data);
		}
	});	
});
router.post('/readSlide', function(req, res, next) {
	var fileName = req.body.fileName;
	fs.readFile('../PMS/public/files/slide/'+fileName,function(error,data){
			if(error) {
				console.log(error.message);
				res.end(error.message);				
			}else{
				console.log('readSlide 읽기성공');
				res.writeHead(200,{'Content-Type' : 'text/html'});
				console.log(data);
				res.end(data);
			}
	});	
});

router.post('/downloadSlide',function(req,res){
	var data = req.body.data;
	console.log(data);
	var dataTxt = JSON.stringify(data);
	
	var fileName ="12345.do";
	var filePath = "../PMS/public/files/slide/"+fileName;
	fs.writeFile(filePath, dataTxt, (err) => {  
		if (err) {
			console.log(err);			
		}else{
			res.download(filePath);
		}
	});
	
	
	
});

router.post('/importSpread', function(req, res, next) {
	//console.log('/importSpread');
	var path = req.body.path;	
	//console.log(path);	
	fs.readFile('../PMS/public/files/spread/'+path,function(error,data){
			if(error) {
				console.log(error.message);
				res.end(error.message);				
			}else{
				console.log('json 읽기성공');
				res.writeHead(200,{'Content-Type' : 'text/html'});
				//console.log(data);
				res.end(data);
			}
	});	
});

router.post('/saveSheet', function(req, res, next) {
	var json = req.body.content;
	var id = req.body.id;
	var agencyNo = req.body.agencyNo;
	var proNo = req.body.proNo;
	var fileName = req.body.fileName+'.json';
	var title = req.body.title;
	var name = req.body.name;
	var docNo = req.body.docNo;
	console.log(json);
	console.log(id + '/' + agencyNo + '/' + proNo);
	console.log(fileName);
	var filePath = "../PMS/public/files/spread/"+fileName;
	fs.writeFile(filePath, JSON.stringify(json), (err) => {  
		if (err) {
			console.log(err);
		};
	});
	var fileInfo = {id:id,proNo:proNo,fileName:fileName,title:title,docNo:docNo};
	sQuery.checkSpread(fileInfo,function(err,result){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('------------------------');
			console.log(result);
			console.log(result.CNT);
			console.log('------------------------');
			if(result[0].CNT>0){
				console.log('이미있으니 수정!');	
				sQuery.updateSpread(fileInfo,function(err,cnt){
					if(err){
						console.log(err);
						return;
					}else{
						if(cnt>0){
							console.log('수정성공!');
							res.json({result:cnt});			
						}else{
							res.json({result:cnt});
						}

					}
				});
			}else{
				console.log('없으니 추가!');						
				sQuery.insertSpread(fileInfo,function(err,cnt){
					if(err){
						console.log(err);
						return;
					}else{
						if(cnt>0){
							console.log('등록성공!');
							res.json({result:cnt});			
						}else{
							res.json({result:cnt});
						}

					}
				});
			}

		}
	});
	return;
});

router.get('/today', function(req, res, next) {
  var today = format.asString('yyyy년MM월dd일', new Date());
  res.end(today);
});


router.get('/downloadFile/:fileName/:roomNo',function(req,res){
	var fn = req.params.fileName;
	var rn = req.params.roomNo;
	console.log('다운받는 파일 : %s',fn);
	var downFile = '../PMS/public/files/room'+rn+'/'+ fn;
	console.log(downFile);
	res.download(downFile);
});

router.post('/userIcon',function(req,res){

	var form = new multiparty.Form();
	
	form.parse(req, function (err, fields, files) {
		var id = fields.mem_id[0];
		console.log('회원 아이디 : ',id);
		var file = files.profile_picture[0];
		var fileName = file.originalFilename;
		var ext  = fileName.substr(fileName.length-3,fileName.length);
		var newpath = '/PMS/public/images/userIcon/img_'+id+'.'+ext;
		var oldpath = file.path;
		// 파일 전송이 요청되면 이곳으로 온다.
		// 에러와 필드 정보, 파일 객체가 넘어온다.
		//console.log('필드정보');
		//console.log(fields);
		//console.log('파일정보');
		//console.log(files);
		fs.rename(oldpath, newpath, function (err) {
			if (err){
				res.json({result:err});		
			}else{
				res.json({result:1});		
			}
			
		});	
		//var path = files.fileInput[0].path;
		//console.log(path);
		 // 파일과 예외 처리를 한 뒤 브라우저로 응답해준다.
    });
});

router.post('/roomImg',function(req,res){

	var form = new multiparty.Form();
	
	form.parse(req, function (err, fields, files) {
		var name = fields.addMeetingRoomName[0];
		var agency_no = fields.agency_no[0];
		console.log('방제목 : ',name);
		var file = files.addMeetingRoomfile[0];
		var fileName = file.originalFilename;
		var ext  = fileName.substr(fileName.length-3,fileName.length);
		var newpath = '/PMS/public/images/roomImages/'+agency_no+fileName;
		var oldpath = file.path;
		fs.rename(oldpath, newpath, function (err) {
			if (err){
				res.json({result:err});		
			}else{
				res.json({result:1});		
			}
		});	
    });
	
});


module.exports = router;
