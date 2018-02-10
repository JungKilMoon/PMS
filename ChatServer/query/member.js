var oracledb = require('oracledb');
var dbConfig = require('../public/config/dbconfig.js');
var connAttrs = {
	user          : dbConfig.user,
	password      : dbConfig.password,
	connectString : dbConfig.url
}
 
module.exports = {

	getMemCheck : function (findId,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		conn.execute("select m.nickname,m.mem_id,m.mem_name,a.agency_name,m.agency_no,m.chat_status from member m,agency a where a.agency_no = m.agency_no and m.mem_id=:findId",[findId],{					
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
					  console.log('Error executing query', err);
					  cb(err);
					  conn.close(function(err) {
						if (err) {
						  console.log('Error closing connection', err);
						} else {
						  console.log('Connection closed');
						}
					  });
					  return;
					}
					var resJson = JSON.stringify(result.rows);					
					var jsonRes = JSON.parse(resJson);
					cb(null,jsonRes);
					//res.json(jsonRes);

					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("getMemCheck Function : Connection released");									
							}
						}
					);
				});
	  });
	},
	getFriendList : function (loginId,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}				
		conn.execute("select t.mem_id,t.room_no,m.mem_name,m.chat_status,m.agency_no,m.nickname,a.agency_name from friendlist f, friendlist t, member m, agency a where t.mem_id=m.mem_id and m.agency_no = a.agency_no and f.mem_id=:loginId and f.friend_type=0 and f.room_no = t.room_no and t.friend_type =0 and t.mem_id != :loginId and t.pro_no is null order by t.room_no",[loginId],{					
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
					  console.log('Error executing query', err);
					  cb(err);
					  conn.close(function(err) {
						if (err) {
						  console.log('Error closing connection', err);
						} else {
						  console.log('Connection closed');
						}
					  });
					  return;
					}
					//console.log('getFriendList');
					//console.log(result.rows);
					
					var resJson = JSON.stringify(result.rows);
					var jsonRes = JSON.parse(resJson);					
					cb(null,jsonRes);
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("getFriendList Function : Connection released");									
							}
						}
					);
				});
	  });
	},
	getChatRoomList : function (loginId,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		
		conn.execute("select f.room_no,r.room_title from friendlist f,room r where f.room_no=r.room_no and f.friend_type=1 and f.mem_id=:loginId",[loginId],{					
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
					  console.log('Error executing query', err);
					  cb(err);
					  conn.close(function(err) {
						if (err) {
						  console.log('Error closing connection', err);
						} else {
						  console.log('Connection closed');
						}
					  });
					  return;
					}
					//console.log('getFriendList');
					//console.log(result.rows);
					
					var resJson = JSON.stringify(result.rows);
					var jsonRes = JSON.parse(resJson);					
					cb(null,jsonRes);
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("getChatRoomList Function : Connection released");									
							}
						}
					);
				});
	  });
	},
	addFriend : function (loginId,friendId,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		
		conn.execute("insert into room (room_no,room_title,create_date) values(room_seq.nextval,:loginId || ' / ' || :friendId || ' 대화방',sysdate)",[loginId,friendId],{					
				autoCommit: true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
					  console.log('Error executing query', err);
					  cb(err);
					  conn.close(function(err) {
						if (err) {
						  console.log('Error closing connection', err);
						} else {
						  console.log('Connection closed');
						}
					  });
					  return;
					}
					var cnt = result.rowsAffected;
					//console.log('db의 cnt',cnt);
					cb(null,cnt);
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("getChatRoomList Function : Connection released");									
							}
						}
					);
				});
	  });
	},
		maxRoomNo : function (cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		
		conn.execute("select max(room_no) roomNo from room",[],{					
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
					  console.log('Error executing query', err);
					  cb(err);
					  conn.close(function(err) {
						if (err) {
						  console.log('Error closing connection', err);
						} else {
						  console.log('Connection closed');
						}
					  });
					  return;
					}
					var resJson = JSON.stringify(result.rows);						
					var jsonRes = JSON.parse(resJson);
					//console.log('생성된 방번호 : ',jsonRes);
					//console.log('생성된 방번호 가져와보자: ',jsonRes[0].ROOMNO);
					cb(null,jsonRes);
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("getChatRoomList Function : Connection released");									
							}
						}
					);
				});
	  });
	},
	insertFriendlistLoginId : function (loginId,roomNo,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		
		conn.execute("insert into friendlist (friend_no,mem_id,room_no) values(friendlist_seq.nextval,:loginId,:roomNo)",[loginId,roomNo],{
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
					  console.log('Error executing query', err);
					  cb(err);
					  conn.close(function(err) {
						if (err) {
						  console.log('Error closing connection', err);
						} else {
						  console.log('Connection closed');
						}
					  });
					  return;
					}
					var cnt = result.rowsAffected;
					//console.log('로그인아이디 친추성공여부 : ',cnt);
					cb(null,cnt);
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("getChatRoomList Function : Connection released");									
							}
						}
					);
				});
	  });
	},
	insertFriendlistFriendId : function (friendId,roomNo,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		
		conn.execute("insert into friendlist (friend_no,mem_id,room_no) values(friendlist_seq.nextval,:loginId,:roomNo)",[friendId,roomNo],{
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
					  console.log('Error executing query', err);
					  cb(err);
					  conn.close(function(err) {
						if (err) {
						  console.log('Error closing connection', err);
						} else {
						  console.log('Connection closed');
						}
					  });
					  return;
					}
					var cnt = result.rowsAffected;
					//console.log('친구아이디 친추성공여부 : ',cnt);
					cb(null,cnt);
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("getChatRoomList Function : Connection released");									
							}
						}
					);
				});
	  });
	},
	talkLogin : function (loginId,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		
		conn.execute("update member set chat_status='LOGIN' where mem_id=:loginId ",[loginId],{
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
					  console.log('Error executing query', err);
					  cb(err);
					  conn.close(function(err) {
						if (err) {
						  console.log('Error closing connection', err);
						} else {
						  console.log('Connection closed');
						}
					  });
					  return;
					}
					var cnt = result.rowsAffected;
					console.log('로그인 성공~! : ',cnt);
					cb(null,cnt);
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("getChatRoomList Function : Connection released");									
							}
						}
					);
				});
	  });
	},
	chatStatusUpdate : function insertMsg(id,cb){
		oracledb.getConnection(connAttrs, function (err, conn) {
			if (err) {
				console.log('dbconnection Error');
				return;
			}		  
			conn.execute("update member set chat_status='LOGOUT' where mem_id=:id", 
					[id], {
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
								console.log('로그아웃 성공~! : ',cnt);
							}else{
								console.log('로그아웃 실패~! : ',cnt);
							}
							cb(null,cnt);
							
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
  
	},
	changeLoginStatus : function insertMsg(id,st,cb){
		oracledb.getConnection(connAttrs, function (err, conn) {
			if (err) {
				console.log('dbconnection Error');
				return;
			}		  
			conn.execute("update member set chat_status=:st where mem_id=:id", 
					[st,id], {
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
								console.log('수정 성공~! : ',cnt);
							}else{
								console.log('수정 실패~! : ',cnt);
							}
							cb(null,cnt);
							
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
	//changeLoginStatus
	
	
	
	
	

}

