var oracledb = require('oracledb');
var dbConfig = require('../public/config/dbconfig.js');
var connAttrs = {
	user          : dbConfig.user,
	password      : dbConfig.password,
	connectString : dbConfig.url
}

module.exports = { 
   
	getEventMaxNo : function (cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}
			console.log('db커넥션완료');
		conn.execute("select max(e_no) from events",[],{					
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
					console.log(result);
					var resJson = JSON.stringify(result.rows[0]);					
					var readJson = JSON.parse(resJson);
					console.log(readJson);
					
					cb(null,readJson);					
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
	/*
E_NO	no
E_PRO_NO	pro_no
E_TITLE title
E_CONTENT content
E_TYPE type
E_STATUS id
E_START start
E_END end
E_PROGRESS progress
E_UPDATE update
E_MEM mem
*/
	insertEvent : function (evt,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}
		console.log('db커넥션완료');
		conn.execute("insert into events (e_no,e_pro_no,e_title,e_content,e_type,e_status,e_start,e_end,e_update,e_mem,e_color)"+ 
				"values(events_seq.nextval,:e_pro_no,:e_title,:e_content,:e_type,:e_status,:e_start,:e_end,:e_update,:e_mem,:e_color)",
						[evt.pro_no,evt.title,evt.content,evt.type,evt.id,evt.start,evt.end,evt.update,evt.mem,evt.color],
			{					
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
					console.log(result.rowsAffected);
					var cnt = result.rowsAffected;
					if(cnt>0){
						cb(null,cnt);
					}else {
						cb(err);
					}
										
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
	//update
	updateEvent : function (evt,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}
		console.log('db커넥션완료');
		console.log(evt.no);
		conn.execute(
				"update events set e_content = :e_content, e_title = :e_title, e_type =:e_type,"+
				"e_status =:e_status, e_progress = :e_progress, e_update = :e_update, e_mem = :e_mem,"+
				"e_color = :e_color where e_no = :e_no",
				[
				evt.content,
				evt.title,
				evt.type,
				evt.id,
				evt.progress,
				evt.update,
				evt.mem,
				evt.color,
				evt.no
				],
			{					
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
					console.log(result);
					var cnt = result.rowsAffected;
					if(cnt>0){
						cb(null,cnt);
					}else {
						cb(err);
					}
										
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
	deleteEvent : function (evtNo,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}
		conn.execute("delete from events where e_no = :evtNo",
						[evtNo],{	
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
					if(cnt>0){
						cb(null,cnt);
					}else {
						cb(err);
					}
										
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
	
	getProEventSources : function (proNo,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}
		console.log('db커넥션완료');
		conn.execute("select * from events where e_pro_no = :proNo",
						[proNo],{					
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
					cb(null,result.rows);
										
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
	getCheckEventSources : function (proNo,id,cb){	
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}
		console.log('getCheckEventSources 커넥션완료');
		conn.execute("select * from events where e_pro_no = :proNo and e_status = :id",
						[proNo,id],{					
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
					cb(null,result.rows);
										
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
	}



}
