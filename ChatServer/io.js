module.exports = function(server){
  var format = require('date-format');
  var io = require('socket.io')(server);
  var SocketIOFile = require('socket.io-file');
  var fs = require('fs');
  var path = require('path');
  var cQuery = require('./query/chat.js');
  var uploader = null;
  var idMap = new Map();
  var docMap = new Map();
  var sMap = new Map();
  
  console.log('init 1');
  io.on('connection', function(socket){	  
  console.log('init 2');
  console.log(docMap);
	    firstMsg = "";
	    console.log('user connected: ', socket.id)
	    var userId = socket.id;				
		var loginId = "";	    
		var loginName = "";
		var roomNo ="";
		
		var s_id="";		
		var s_name="";
		var s_dNo ="";
		var s_pNo = "";
		
		//Slide Start
		socket.on('join:slide',function(data){		
			s_id   = data.loginId;
			s_name = data.loginName;
			s_pNo  = data.proNo;
			s_dNo  = data.docNo;
			if(sMap.get(s_dNo)==null){
				var arr = [s_id];
				sMap.set(s_dNo,arr);
				console.log(sMap.get(s_dNo));
			}else{
				var arr = sMap.get(s_dNo);
				arr.push(s_id);
				sMap.set(s_dNo,arr);
			}
			console.log('슬라이드 접속 정보 ');
			console.log('아이디 : %s / 이름 : %s / 프로젝트번호 : %s / 슬라이드번호 : %s ',s_id,s_name,s_pNo,s_dNo);			
			console.log(sMap.get(s_dNo));
			socket.join(s_dNo);
			io.sockets.in(s_dNo).emit('slideIn',sMap.get(s_dNo));
		});
		
		socket.on('slide changeTitle',function(data){
			socket.broadcast.emit('slide changeTitle',data);
		});
		
		socket.on('slide create',function(data){
			socket.broadcast.emit('slide create',data);
		});
		
		socket.on('slide draw',function(data){
			
		});
		
		socket.on('slide remove',function(data){
			socket.broadcast.emit('slide remove',data);
		})
		//Slide End
		
		
		
		//Sperad Start
		var p_id ="";
		var p_name="";
		var p_dNo ="";
		var p_pNo = "";			
		
		socket.on('join:spread',function(data){		
			p_id   = data.loginId;
			p_name = data.loginName;
			p_pNo  = data.proNo;
			p_dNo  = data.docNo;
			if(docMap.get(p_dNo)==null){
				var arr = [p_id];
				docMap.set(p_dNo,arr);
				console.log(docMap.get(p_dNo));
			}else{
				var arr = docMap.get(p_dNo);
				arr.push(p_id);
				docMap.set(p_dNo,arr);
			}
			console.log('스프레드 접속 정보 ');
			console.log('아이디 : %s / 이름 : %s / 프로젝트번호 : %s / 스프레드번호 : %s ',p_id,p_name,p_pNo,p_dNo);			
			console.log(docMap.get(p_dNo));
			socket.join(p_dNo);
			io.sockets.in(p_dNo).emit('my message',docMap.get(p_dNo));
			
		});
		
		socket.on('content',function(data){
			console.log(data);
			socket.broadcast.emit('contentTyping',data);
		});
		
		
		socket.on('clearAll',function(data){
			console.log(data);
			socket.broadcast.emit('clearData',data);
		});
		
		socket.on('editTable',function(data){
			console.log(data);
			socket.broadcast.emit('createTable',data);
		})
		
		socket.on('changeTable',function(data,_activeTable){
			console.log(data);
			console.log(_activeTable);
			socket.broadcast.emit('changeTableStyle',data,_activeTable);
		})
		
		socket.on('addPicture',function(data){
			console.log(data);
			socket.broadcast.emit('receivePicutre',data);
		});
		socket.on('merge',function(data){
			console.log(data);
			socket.broadcast.emit('receiveMerge',data);
		});
		//Sperad End
		
		
		

		
		
		//Chat Start
		socket.on('join:login',function(data){			
			loginId = data.loginId;			
			loginName = data.loginName;
			idMap.set(loginId,userId);
			console.log(idMap);
			//socket.join('member '+loginId);
		});
		
		socket.on('addFriend',function(data){
			// id => 친구 대상자 아이디 (친구추가신청한사람 X)
			var targetSocket = idMap.get(data.id);
			io.to(targetSocket).emit('addmyFriend',loginId,data.roomNo);
			
		});
		
		socket.on('statusChange',function(id,stat){
			socket.broadcast.emit('loginStatusChange',id,stat);
		});
		
		socket.on('join:room',function(data){
			loginId = data.loginId;
			loginName = data.loginName;
			chatId = data.chatId;
			chatNm = data.chatNm;
			roomNo = data.roomNo;
			if(roomNo=='0'){
				roomNo='9999';
			}
			socket.join(roomNo);
			
			cQuery.getMsg(io,roomNo,socket);				
			console.log('/socket.io 오픈 : login id : %s / loginName : %s / chatId : %s / chatNm : %s / roomNo : %s',loginId,loginName,chatId,chatNm,roomNo);
			io.sockets.in(roomNo).emit('login message','(알림) '+loginId+' / '+loginName + '님이 입장하셨습니다.');
			//socket.broadcast.emit('login message','(알림) '+loginId+' / '+loginName + '님이 입장하셨습니다.');
			startUploader(socket);
		});	
		
		
		//일반메시지
		socket.on('message', function(msg){
			var time = format.asString('yyyy년MM월dd일 hh시mm분ss초', new Date()); //just the time 
			var myMsg = loginId + ' / ' + loginName;
			var type= 'N';
			//console.log(msg);
  	        cQuery.insertMsg(roomNo,msg,loginId,type,time,loginName);
			io.sockets.in(roomNo).emit('my message', msg,myMsg,time,loginId);
		}); 
		socket.on('icon message', function(msg){
			var time = format.asString('yyyy년MM월dd일 hh시mm분ss초', new Date()); //just the time 
			var myMsg = loginId + ' / ' + loginName;
			var type= 'I';
  	        cQuery.insertMsg(roomNo,msg,loginId,type,time,loginName);
			io.sockets.in(roomNo).emit('my iMessage', msg,myMsg,time,loginId);
		});
		
		socket.on('upload completeMsg',function(file,uploaderId,uploaderName,uploaderRoomNo){			
			var time = format.asString('yyyy년MM월dd일 hh시mm분ss초', new Date()); //just the time
			var fileSize = (file.size/1000000);					
			var sendMsg = file.data.oName+' 파일을 보냈습니다.<br><a id="'+file.data.oName+'" href="/downloadFile/'+file.data.fName+'/'+uploaderRoomNo+'"><button style="margin:5px"class="w3-button w3-blue w3-round-large">다운로드('+fileSize.toFixed(2)+'MB)</button></a>' ;
			//var sendMsg = file.name+'('+fileSize.toFixed(2)+'MB)' + '파일을 보냈습니다.<br><a id="'+file.name+'" href="/downloadFile/'+file.name+'"><img style="width:38px;height:38px;padding:3px;" src="/img/download">다운로드</a>' ;
			//var dbMsg = file.name+"("+fileSize.toFixed(2)+"MB)" + "파일을 보냈습니다.<br><a id='"+file.name+"' href='#'>다운로드</a>" ;
			var myMsg = uploaderId + ' / ' + uploaderName;
			var type='N';
			cQuery.insertMsg(uploaderRoomNo,sendMsg,uploaderId,type,time,uploaderName);
			io.sockets.in(uploaderRoomNo).emit('my message',sendMsg,myMsg,time,loginId);
		});
		socket.on('upload completeIMsg',function(file,uploaderId,uploaderName,uploaderRoomNo){
			console.log('이미지전용완료');
			var time = format.asString('yyyy년MM월dd일 hh시mm분ss초', new Date()); //just the time
			var fileSize = (file.size/1000000);
			var sendMsg = '<img class="di w3-hover-opacity" id="'+file.data.fName+'" src="/imgs/imgView/'+file.data.fName+'/'+roomNo+'"><br><a href="/downloadFile/'+file.data.fName+'/'+uploaderRoomNo+'" id="'+file.data.fName+'">다운받기</a>';
			//var sendMsg = file.data.oName+' 파일을 보냈습니다.<br><a id="'+file.data.oName+'" href="/downloadFile/'+file.data.fName+'/'+uploaderRoomNo+'"><button style="margin:5px"class="w3-button w3-blue w3-round-large">다운로드('+fileSize.toFixed(2)+'MB)</button></a>' ;
			var myMsg = uploaderId + ' / ' + uploaderName;
			var type='I';
			cQuery.insertMsg(uploaderRoomNo,sendMsg,uploaderId,type,time,uploaderName);
			io.sockets.in(uploaderRoomNo).emit('my imageMessage',sendMsg,myMsg,time,loginId);
		});
		
		socket.on('disconnect',function(){
			io.sockets.in(roomNo).emit('login message','(알림) '+loginId+' / '+loginName + '님이 나가셨습니다.');
			//socket.broadcast.emit('login message','(알림) '+loginId + '님이 나가셨습니다.');
			if(docMap.get(p_dNo)!=null){
				var index  = docMap.get(p_dNo).indexOf(p_id);
				if (index !== -1) {
					docMap.get(p_dNo).splice(index, 1);
				}
				io.sockets.in(p_dNo).emit('my message',docMap.get(p_dNo));
				console.log('삭제완료' + docMap.get(p_dNo));			
			}else{
				console.log(docMap);
				console.log(p_dNo);
				console.log(docMap.get(p_dNo));
			}
			
			if(sMap.get(s_dNo)!=null){
				var index  = sMap.get(s_dNo).indexOf(s_id);
				if (index !== -1) {
					sMap.get(s_dNo).splice(index, 1);
				}
				io.sockets.in(s_dNo).emit('my message',sMap.get(s_dNo));
				console.log('삭제완료' + sMap.get(s_dNo));			
			}else{
				console.log(sMap);
				console.log(s_dNo);
				console.log(sMap.get(s_dNo));
			}
			console.log('종료 => %s / %s / %s',userId,loginId,loginName);
			
		});
		
		uploader = new SocketIOFile(socket, {
			uploadDir: 'public/files/tmp',							// simple directory
			accepts: ["video/3gpp","application/octet-stream","application/postscript","audio/x-aiff","application/pgp-signature",
			"video/x-ms-asf","application/atom+xml","audio/basic","video/x-msvideo","application/x-msdownload","image/bmp",
			"application/x-bzip2","text/x-c","application/vnd.ms-cab-compressed","text/x-c","application/vnd.ms-htmlhelp","text/plain",
			"application/x-x509-ca-cert","text/css","text/csv","application/x-debian-package","text/x-diff","image/vnd.djvu",
			"image/vnd.djvu","application/msword","application/xml-dtd","application/x-dvi","application/java-archive","text/x-fortran",
			"video/x-flv","text/x-script.ruby","image/gif","application/x-gzip","text/html","image/vnd.microsoft.icon","text/calendar",
			"text/x-java-source","application/x-java-jnlp-file","image/jpeg","image/jpeg","application/javascript","application/json",
			"audio/x-mpegurl","video/mp4","application/mathml+xml","application/mbox","audio/midi","message/rfc822","video/x-mng",
			"video/quicktime","audio/mpeg","video/mp4","video/mpeg","application/vnd.oasis.opendocument.presentation",
			"application/vnd.oasis.opendocument.spreadsheet","application/vnd.oasis.opendocument.text","application/ogg","text/x-pascal",
			"image/x-portable-bitmap","application/pdf","image/x-portable-graymap","application/pgp-encrypted","text/x-script.perl",
			"text/x-script.perl-module","image/png","image/x-portable-anymap","image/x-portable-pixmap","application/vnd.ms-powerpoint",
			"image/vnd.adobe.photoshop","text/x-script.python","audio/x-pn-realaudio","application/x-rar-compressed","application/rdf+xml",
			"application/x-redhat-package-manager","application/rss+xml",
			"application/rtf","text/x-asm","text/sgml","application/x-sh","image/svg+xml","application/x-shockwave-flash",
			"application/x-tar","application/x-bzip-compressed-tar","application/x-tcl","application/x-tex",
			"application/x-texinfo","image/tiff","application/x-bittorrent","text/troff","text/x-vcard",
			"text/x-vcalendar","model/vrml","audio/x-wav","audio/x-ms-wma","video/x-ms-wmv","video/x-ms-wmx",
			"application/wsdl+xml","image/x-xbitmap","application/xhtml+xml","application/vnd.ms-excel","image/x-xpixmap",
			"application/xml","application/xslt+xml","text/yaml","application/zip",".zip","application/x-7z-compressed","application/x-zip-compressed"			
			],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
			maxFileSize: 30194304, 						// 4 MB. default is undefined(no limit)
			chunkSize: 5120,							// default is 10240(1KB)
			transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
			overwrite: true,		  // overwrite file if exists, default is true.
			rename : 'tmpfile.jpg'
		});
			
			
		//Uploader Start		
		function startUploader(socket){
			console.log('roomNo : %s',roomNo);
			uploader = new SocketIOFile(socket, {
			uploadDir: 'public/files/room'+roomNo,							// simple directory
			accepts: ["video/3gpp","application/octet-stream","application/postscript","audio/x-aiff","application/pgp-signature",
			"video/x-ms-asf","application/atom+xml","audio/basic","video/x-msvideo","application/x-msdownload","image/bmp",
			"application/x-bzip2","text/x-c","application/vnd.ms-cab-compressed","text/x-c","application/vnd.ms-htmlhelp","text/plain",
			"application/x-x509-ca-cert","text/css","text/csv","application/x-debian-package","text/x-diff","image/vnd.djvu",
			"image/vnd.djvu","application/msword","application/xml-dtd","application/x-dvi","application/java-archive","text/x-fortran",
			"video/x-flv","text/x-script.ruby","image/gif","application/x-gzip","text/html","image/vnd.microsoft.icon","text/calendar",
			"text/x-java-source","application/x-java-jnlp-file","image/jpeg","image/jpeg","application/javascript","application/json",
			"audio/x-mpegurl","video/mp4","application/mathml+xml","application/mbox","audio/midi","message/rfc822","video/x-mng",
			"video/quicktime","audio/mpeg","video/mp4","video/mpeg","application/vnd.oasis.opendocument.presentation",
			"application/vnd.oasis.opendocument.spreadsheet","application/vnd.oasis.opendocument.text","application/ogg","text/x-pascal",
			"image/x-portable-bitmap","application/pdf","image/x-portable-graymap","application/pgp-encrypted","text/x-script.perl",
			"text/x-script.perl-module","image/png","image/x-portable-anymap","image/x-portable-pixmap","application/vnd.ms-powerpoint",
			"image/vnd.adobe.photoshop","text/x-script.python","audio/x-pn-realaudio","application/x-rar-compressed","application/rdf+xml",
			"application/x-redhat-package-manager","application/rss+xml",
			"application/rtf","text/x-asm","text/sgml","application/x-sh","image/svg+xml","application/x-shockwave-flash",
			"application/x-tar","application/x-bzip-compressed-tar","application/x-tcl","application/x-tex",
			"application/x-texinfo","image/tiff","application/x-bittorrent","text/troff","text/x-vcard",
			"text/x-vcalendar","model/vrml","audio/x-wav","audio/x-ms-wma","video/x-ms-wmv","video/x-ms-wmx",
			"application/wsdl+xml","image/x-xbitmap","application/xhtml+xml","application/vnd.ms-excel","image/x-xpixmap",
			"application/xml","application/xslt+xml","text/yaml","application/zip",".zip","application/x-7z-compressed","application/x-zip-compressed"		
			],
			maxFileSize: 30194304, 						// 4 MB. default is undefined(no limit)
			chunkSize: 5120,							// default is 10240(1KB)
			transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
			overwrite: true,		  // overwrite file if exists, default is true.
				rename: function(filename) {
					var file = path.parse(filename);
					var fname = file.name;
					var ext = file.ext;				
				return 'PMS_'+roomNo+format.asString('yyyy', new Date())+fname+ext;
				}
			});

			uploader.on('start', (fileInfo) => {
				console.log('Start uploading');
				//console.log(fileInfo);
			});
			uploader.on('stream', (fileInfo) => {
				//console.log(fileInfo);
				//console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
			});
			uploader.on('complete', (fileInfo) => {
				console.log('Upload Complete.');
			});
			uploader.on('error', (err) => {
				console.log('Error!', err);
			});
			uploader.on('abort', (fileInfo) => {
				console.log('Aborted: ', fileInfo);
			});
		}
		//Uploader End
			
	});	
   return io; 

  }
  

	
 
