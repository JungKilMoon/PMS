var express = require('express');
var oracledb = require('oracledb');
var router = express.Router();
var eQuery = require('../query/events.js');
/*
	     1. 신규 = blue  
	     2. 진행 = green 
	     3. 해결 = aqua
	     4. 의견 = orange
	     5. 완료 = purple
*/

router.post('/proEventSources',function(req,res){
	console.log('events/proEventSources 진입!!');
	var proNo = req.body.proNo;
	console.log(proNo);
	eQuery.getProEventSources(proNo,function(err,data){
		if(err){
			console.log(err);
			res.json({result : "err"});
			return;
		}else{
			console.log('proEventSources 콜백받음');
			var evtSources = [];
			for(var i in data){
			var evtJson = {
					no : data[i].E_NO,
					id : data[i].E_STATUS,
					title : data[i].E_TITLE,
					content : data[i].E_CONTENT,
					start : data[i].E_START,
					end : data[i].E_END,
					type : data[i].E_TYPE,
					progress : data[i].E_PROGRESS,
					mem : data[i].E_MEM,
					color : data[i].E_COLOR,
					time : data[i].E_UPDATE					
				};
				console.log(evtJson);
				evtSources.push(evtJson);
			}
			res.json(evtSources);
		}
	});
});
router.post('/checkEventSources',function(req,res){	
	var proNo = req.body.proNo;
	var id = req.body.id;
	eQuery.getCheckEventSources(proNo,id,function(err,data){
		if(err){
			console.log(err);
			res.json({result : "err"});
			return;
		}else{
			console.log('proEventSources 콜백받음');
			var evtSources = [];
			for(var i in data){
			var evtJson = {
					no : data[i].E_NO,
					id : data[i].E_STATUS,
					title : data[i].E_TITLE,
					content : data[i].E_CONTENT,
					start : data[i].E_START,
					end : data[i].E_END,
					type : data[i].E_TYPE,
					progress : data[i].E_PROGRESS,
					mem : data[i].E_MEM,
					color : data[i].E_COLOR	,
					time : data[i].E_UPDATE
				};
				console.log(evtJson);
				evtSources.push(evtJson);
			}
			res.json(evtSources);
		}
	});
});
router.get('/nowEvent',function(req,res){
	console.log('nowEvent');
	eQuery.getEventMaxNo(function(err,maxNo){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('eventMax에서 콜백받음');
			res.json(maxNo);
		}
	});
});

router.post('/insert',function(req,res){
	var evt = req.body.evt;
	console.log('events/insert 진입!!');	
	console.log(evt);
	eQuery.insertEvent(evt,function(err,cnt){
		if(err){
			console.log(err);
			res.json({cnt : -1});
			return;
		}else{
			console.log('insertEvent 콜백받음');
			res.json({cnt : cnt});
		}
	});
});
router.post('/update',function(req,res){
	var evt = req.body.evt;
	console.log('events/update 진입!!');	
	console.log(evt);
	eQuery.updateEvent(evt,function(err,cnt){
		if(err){
			console.log(err);
			res.json({cnt : -1});
			return;
		}else{
			console.log('insertEvent 콜백받음');
			res.json({cnt : cnt});
		}
	});
});
router.post('/delete',function(req,res){
	var evtNo = req.body.evtNo;
	console.log('events/delete 진입!!');	
	console.log(evtNo);
	eQuery.deleteEvent(evtNo,function(err,cnt){
		if(err){
			console.log(err);
			res.json({cnt : -1});
			return;
		}else{
			console.log('insertEvent 콜백받음');
			res.json({cnt : cnt});
		}
	});
});
module.exports = router;