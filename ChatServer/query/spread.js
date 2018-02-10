var oracledb = require('oracledb');
var dbConfig = require('../public/config/dbconfig.js');
var connAttrs = {
	user          : dbConfig.user,
	password      : dbConfig.password,
	connectString : dbConfig.url
}

module.exports = {
	  insertSpread : function(f,cb){
		  console.log(f);
		  oracledb.getConnection(connAttrs, function (err, conn) {
			if (err) {
				console.log('dbconnection Error');
				return;
			}		
			//var fileInfo = {name:name,proNo:proNo,fileName:fileName,title:title};
			conn.execute("insert into document (DOC_NO,DOC_TITLE,DOC_CONTENT,DOC_WRITER,DOC_DATE,DOC_PRO_NO,DOC_TYPE) values(:docNo,:title,:fileName,:id,sysdate,:proNo,'SPREAD')",[f.docNo,f.title,f.fileName,f.id,f.proNo],{					
					autoCommit:true,
					outFormat: oracledb.OBJECT // Return the result as Object
				},
					function (err, result) {
						if (err) {
							console.log('coneection.excute 실패');
							console.log(err.message);
							cb(null,0);
						} else {
							var cnt = result.rowsAffected;
							cb(null,cnt);
						}
						
						// Release the connection
						conn.release(
							function (err) {
								if (err) {
									console.error(err.message);
								} else {
									console.log("insertSpread Function : Connection released");									
								}
							}
						);
					});
		  });
	  },
	  
    updateSpread : function(f,cb){
	  console.log(f);
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		//var fileInfo = {name:name,proNo:proNo,fileName:fileName,title:title};
		conn.execute("update document set doc_title = :title, doc_content = :fileName, doc_u_writer = :id, doc_u_date = sysdate where doc_no=:docNo and doc_type='SPREAD'",[f.title,f.fileName,f.id,f.docNo],{					
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
						console.log('coneection.excute 실패');
						console.log(err.message);
						cb(null,0);
					} else {
						var cnt = result.rowsAffected;
						cb(null,cnt);
					}
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("insertSpread Function : Connection released");									
							}
						}
					);
				});
	  });
	},
    checkSpread : function(f,cb){
	  console.log(f);
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		//var fileInfo = {name:name,proNo:proNo,fileName:fileName,title:title};
		conn.execute("select count(*) cnt from document where doc_no=:docNo",[f.docNo],{					
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
						console.log('coneection.excute 실패');
						console.log(err.message);
						cb(null,0);
					} else {
						var cnt = result.rows;
						var resJson = JSON.stringify(cnt);
						var jsonRes = JSON.parse(resJson);
						cb(null,jsonRes);
					}
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("insertSpread Function : Connection released");									
							}
						}
					);
				});
	  });
	},nextCnt : function(cb){
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		//var fileInfo = {name:name,proNo:proNo,fileName:fileName,title:title};
		conn.execute("select boardwrite6_seq.nextval from dual",[],{					
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
						console.log('coneection.excute 실패');
						console.log(err.message);
						cb(null,0);
					} else {
						var cnt = result.rows;
						var resJson = JSON.stringify(cnt);
						var jsonRes = JSON.parse(resJson);
						cb(null,jsonRes);
					}
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("insertSpread Function : Connection released");									
							}
						}
					);
				});
	  });
	},insertSlide : function(f,cb){
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		//var fileInfo = {name:name,proNo:proNo,fileName:fileName,title:title};
		conn.execute("insert into document (DOC_NO,DOC_TITLE,DOC_CONTENT,DOC_WRITER,DOC_DATE,DOC_PRO_NO,DOC_TYPE) values(:docNo,:title,:fileName,:id,sysdate,:proNo,'SLIDE')",[f.docNo,f.title,f.fileName,f.id,f.proNo],{					
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
						console.log('coneection.excute 실패');
						console.log(err.message);
						cb(null,0);
					} else {
						var cnt = result.rowsAffected;
						cb(null,cnt);
					}
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("insertSpread Function : Connection released");									
							}
						}
					);
				});
	  });
	},
    checkSlide : function(f,cb){
	  console.log(f);
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		//var fileInfo = {name:name,proNo:proNo,fileName:fileName,title:title};
		conn.execute("select count(*) cnt from document where doc_no=:docNo",[f.docNo],{					
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
						console.log('coneection.excute 실패');
						console.log(err.message);
						cb(null,0);
					} else {
						var cnt = result.rows;
						var resJson = JSON.stringify(cnt);
						var jsonRes = JSON.parse(resJson);
						cb(null,jsonRes);
					}
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("insertSpread Function : Connection released");									
							}
						}
					);
				});
	  });
	},updateSlide : function(f,cb){
	  console.log(f);
	  oracledb.getConnection(connAttrs, function (err, conn) {
		if (err) {
			console.log('dbconnection Error');
			return;
		}		
		//var fileInfo = {name:name,proNo:proNo,fileName:fileName,title:title};
		conn.execute("update document set doc_title = :title, doc_content = :fileName, doc_u_writer = :id, doc_u_date = sysdate where doc_no=:docNo and doc_type='SLIDE'",[f.title,f.fileName,f.id,f.docNo],{					
				autoCommit:true,
				outFormat: oracledb.OBJECT // Return the result as Object
			},
				function (err, result) {
					if (err) {
						console.log('coneection.excute 실패');
						console.log(err.message);
						cb(null,0);
					} else {
						var cnt = result.rowsAffected;
						cb(null,cnt);
					}
					
					// Release the connection
					conn.release(
						function (err) {
							if (err) {
								console.error(err.message);
							} else {
								console.log("insertSpread Function : Connection released");									
							}
						}
					);
				});
	  });
	}
	
	//insertSlide
}