var express = require('express');
var fs = require('fs');
var router = express.Router();
var format = require('date-format');
var mQuery = require('../query/member.js');

  
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//채팅 대기화면(채팅목록화면)
router.post('/',function(req,res,next){
	var loginId = req.body.chat.loginId;
	var loginName = req.body.chat.loginName;
	mQuery.talkLogin(loginId,function(err,cnt){
		if(err){
			console.log(err);
			return;
		}else{
			if(cnt>0){
				console.log('바꾸기성공!');
				res.render('talkMain',{
					title : '채팅',
					loginId : loginId,
					loginName : loginName
				});				
			}else{
				console.log('바꾸기실패ㅠ');
			}

		}
	});
});

router.get('/talkReady', function(req, res, next) {
  res.render('talkReady', { title: '접속대기중' });
});


//로그인 상태변경
router.get('/loginStatusChange/:ls/:id',function(req,res){
	var ls = req.params.ls;
	var id = req.params.id;
	console.log(ls);
	mQuery.changeLoginStatus(id,ls,function(err,cnt){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('cnt값 :  ',cnt+"");
			var json = {result:cnt};
			res.json(json);
		}
	});
});

//텍스트드랍 html만들기
router.post('/createHtml',function(req,res){
	var txt = req.body.txt;
	var userNm = req.body.nm;
	var roomNo = req.body.rn;
	var chatNo = 0;
	var fileTxt = "";
	fileTxt += "<h3>내용</h3> ";
	fileTxt += txt+"<br><br>";
	fileTxt += "작성자 : " + userNm+"<br>";
	fileTxt += "작성일자 : " + format.asString('yyyy-MM-dd hh시 mm분 ss초', new Date());;
	
	var fileName = userNm+'_'+chatNo+'.html';
	var filePath = "../PMS/public/files/room"+roomNo+"/"+fileName;
	console.log(filePath);
	fs.writeFile(filePath, fileTxt, (err) => {  
		if (err) {
			console.log(err);
		};
	});
	res.end(fileName);	
});



//채팅방 입장
router.post('/talkPlay', function(req, res, next) {
  var loginId = req.body.chat.loginId;
  var loginName = req.body.chat.loginName;
  var chatId = req.body.chat.chatId;
  var chatNm = req.body.chat.chatNm;
  var roomNo = req.body.chat.roomNo;
  
  console.log('/talkPlay 시작 : login id : %s / loginName : %s, chatId : %s / chatNm : %s / roomNo : %s',loginId,loginName,chatId,chatNm,roomNo,);
  res.render('talkPlay',{
	  title : chatNm+' 채팅방',
	  loginId : loginId,
	  loginName : loginName,
	  roomNo : roomNo,
	  chatId : chatId,
	  chatNm : chatNm
  });
});

//동료 검색
router.post('/findId',function(req,res,next){
	var findId = req.body.findId;
	console.log('검색 아이디 : %s',findId);
	mQuery.getMemCheck(findId,function(err,mem){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('find아이디에서 콜백받음');
			res.json(mem);
		}
	});
});

//날짜검색 전용 날짜포맷
router.post('/makeDateJson',function(req,res,next){
	console.log('makeDateJson');
	var map = req.body.map;
	map = map.replace(/년/g,"-");
	map = map.replace(/월/g,"-");
	map = map.replace(/일/g,"");
	var dateList = map.split('/');
	var resJson = "[";
	for(var i=0; i<dateList.length-1;i++){
		if(i>0){
			resJson+=",";
		}
		resJson += "{";
		//resJson +=	"id : '"+i+"',";
		resJson +=	"title:'이동하기',";		
		resJson +=	"start:'"+dateList[i]+"'";	
		//resJson +=	"color:'black',";
		//resJson +=	"end: '"+dateList[i]+"',";
		//resJson +=	"rendering : 'background'";	
		resJson +=	"}";		
	}
	resJson+="]";
	
	resJson = JSON.stringify(resJson);					
	var readJson = JSON.parse(resJson);
	//console.log(readJson);
	console.log(resJson);
	console.log('------------------------');
	console.log(readJson);
	if(dateList.length==0 || dateList==null){
		var nullJson = "[{ title : 'n', start : '2015-01-01'}]";
		nullJson = JSON.stringify(nullJson);
		var readNull = JSON.parse(nullJson);
		res.json(readNull);
	}else{
		res.json(readJson);
	}
	
});


router.post('/friendList',function(req,res,next){
	var id = req.body.id;
	console.log('검색 아이디 : %s',id);
	mQuery.getFriendList(id,function(err,list){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('list에서 콜백받음');
			console.log(list);			
			res.json(list);
		}
	});
});

router.post('/chatRoomList',function(req,res,next){
	var id = req.body.id;
	console.log('검색 아이디 : %s',id);
	mQuery.getChatRoomList(id,function(err,list){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('list에서 콜백받음');
			console.log(list);			
			res.json(list);
		}
	});
});

router.post('/chatLogout',function(req,res,next){
	var id = req.body.id;
	console.log('로그아웃 대상 아이디 : %s',id);
	mQuery.chatStatusUpdate(id,function(err,cnt){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('cnt값 :  ',cnt+"");
			var json = {result:cnt};
			res.json(json);
		}
	});
});



router.post('/addFriend',function(req,res,next){
	var loginId = req.body.loginId;
	var friendId = req.body.friendId;
	console.log('로긴 아이디 : %s',loginId);
	console.log('추가대상 아이디 : %s',friendId);
	var cnt = 0;
	var roomNo=0;
	mQuery.addFriend(loginId,friendId,function(err,result){
		if(err){
			console.log(err);
			res.json({result:'채팅방 추가하다가 실패'});
			return;
		}else{
			console.log('쿼리를 성공했습니다.=>',result);
			cnt=result;
			if(cnt>0){
				mQuery.maxRoomNo(function(err,result){
					if(err){
						console.log(err);
						res.json({result:'방번호 가져오다가 실패'});
						return;
					}else{						
						console.log('방번호 가져오기성공 .=>',result[0].ROOMNO);
						roomNo=result[0].ROOMNO;
						if(roomNo>0){
							mQuery.insertFriendlistLoginId(loginId,roomNo,function(err,result){
								if(err){
									console.log(err);
									res.json({result:'로그인 아이디 추가하다가 실패'});												
									return;
								}else{
									console.log('로그인 아이디 추가 성공 !.=>',result);
									cnt=result;
									if(cnt>0){
										mQuery.insertFriendlistFriendId(friendId,roomNo,function(err,result){
											if(err){
												console.log(err);
												res.json({result:'친구아이디 추가하다가 실패'});												
												return;
											}else{
												console.log('친구 아이디 추가 성공 !.=>',result);
												cnt = result;
												res.json({result:'true',roomNo:roomNo});
											}
										});	
									}
								}
							});


						}
					}
				});
			}
		}
	});	
	
	
	
});

module.exports = router;
