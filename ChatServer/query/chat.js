var oracledb = require('oracledb');
var dbConfig = require('../public/config/dbconfig.js');
var connAttrs = {
	user          : dbConfig.user,
	password      : dbConfig.password,
	connectString : dbConfig.url
}

module.exports = {

	  getMsg : function(io,roomNo,socket){
		  oracledb.getConnection(connAttrs, function (err, conn) {
			if (err) {
				console.log('dbconnection Error');
				return;
			}		  
			conn.execute("select * from chatting where chat_room_no = :roomNo order by chat_no",[roomNo],{					
					outFormat: oracledb.OBJECT // Return the result as Object
				},
					function (err, result) {
						if (err) {
							console.log('coneection.excute 실패');
							console.log(err.message);
							return false;
						} else {
							if(result.rows>0){
								console.log(result.rows.length);
							}
							//console.log(result);
							//console.log('셀렉트 성공');
							var resJson = JSON.stringify(result.rows);					
							var readJson = JSON.parse(resJson);												
							io.to(socket.id).emit('firstMsg',readJson);
						}
						
						// Release the connection
						conn.release(
							function (err) {
								if (err) {
									console.error(err.message);
								} else {
									console.log("getMsg Function : Connection released");									
								}
							}
						);
					});
		  });
	  },
   
   
	 insertMsg : function(roomNo,msg,loginId,type,time,name){
		 console.log('rooNo : %s / msg : %s / loginId : %s / type : %s / time : %s / name : %s / ',roomNo,msg,loginId,type,time,name);
		oracledb.getConnection(connAttrs, function (err, conn) {
			if (err) {
				console.log('dbconnection Error');
				return;
			}		  
			conn.execute("insert into chatting (chat_no,chat_room_no,chat_content,chat_id,chat_type,chat_date,chat_name) values (chatting_seq.nextval,:roomNo,:msg,:loginId,:type,:time,:name)", 
					[roomNo,msg,loginId,type,time,name], {
						autoCommit: true,
						outFormat: oracledb.OBJECT // Return the result as Object
					},
					function (err, result) {
						if (err) {
							console.log(err.message);
							return false;
						} else {							
							var cnt = result.rowsAffected;
							if(cnt>0){
								console.log('인서트 성공');
							}
							return true;
						}
						
						// Release the connection
						conn.release(
							function (err) {
								if (err) {
									console.error(err.message);
								} else {
									console.log("insertMsgFunction : Connection released");
								}
							}
						);
					});
		  });
  
	}
	
	
	
}