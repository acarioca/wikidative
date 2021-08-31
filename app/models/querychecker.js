var mongoose = require('./db.js');
var fs = require('fs');

var revisionSchema = new mongoose.Schema({
    revid: Number,
    parentid: Number,
    minor: Boolean,
    user: {
        type: String,
        trim: true,
    },
    userid: Number,
    timestamp: {
        type: String,
    },
    size: Number,
    sha1: {
        type: String,
        trim: true,
    },
    parsedcomment: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        trim: true,
    },
    anon: Boolean,
    isAdmin: Boolean,
    isBot: Boolean
})

var Revision = mongoose.model('Revision', revisionSchema, 'revisions');

//pipeline to get all titles
var titlepipline = [
	{
	  $group : {
		 _id : {title:"$title"},
		 count:{$sum:1}
	  }
	},
	{$sort:{"_id":1}}
 ]
// aggregate to call titlepipeline
 Revision.aggregate(titlepipline, function(err,results){
	if (err){
		console.log("Aggregation Error")
	}else{
		console.log("All titles are: ");
		console.log(results)
	}

 })

 //top 5users of a selected article

 var myfirstpipeline = [
	{'$match':{title:"Australia"}},
	{'$group':{'_id':"$user", 'numOfEdits': {$sum:1}}}, 
	{'$sort':{numOfEdits:-1}},
	{'$limit':5}	
];

Revision.aggregate(myfirstpipeline, function(err, results){
	if (err){
		console.log("Aggregation Error")
	} else {
		console.log("Top users of Australia:  ");
		console.log(results)
	}
})

var authordropdown = [];

Revision.aggregate(authordropdown, function(err, results){
    if (err){
        console.log("Author Analytics Error")
    }else{
        console.log("Author details: ");
        console.log(results)
    }
})