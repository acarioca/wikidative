var mongoose = require('./db.js');
var fs = require('fs');

var revisionSchema = new mongoose.Schema({
    revid: {
        type: Number,
        unique: true
    },
    parentid: Number,
    minor: Boolean,
    user: {
        type: String,
        trim: true,
        index: true
    },
    userid: Number,
    timestamp: {
        type: String,
        trim: true,
        index: true
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
        index: true
    },
    anon: Boolean,
    isAdmin: Boolean,
    isBot: Boolean
})





//Fetches the most or least revised articles 
revisionSchema.statics.findMostnLeastRevised = function(limit, sortingOrder, callback) {
    var pipeline = [{
            $group: {
                _id: "$title",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: sortingOrder } },
        { $limit: limit }
    ];
    return this.aggregate(pipeline).exec(callback);
}

//Fetches the group with largest and smallest number of unique registered users
revisionSchema.statics.findRegUserRevisions = function(limit, sortingOrder, callback) {
    var pipeline = [{
            $match: {
                isBot: { $exists: false },
                anon: { $exists: false }
            }
        },
        {
            $group: {
                _id: {
                    title: { $trim: { input: '$title' } },
                    user: { $trim: { input: '$user' } }
                }
            }
        },
        {
            $group: {
                _id: '$_id.title',
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: sortingOrder
            }
        },
        {
            $limit: limit
        }
    ];
    return this.aggregate(pipeline).exec(callback);
}

//Fetches the most and least oldest articles

revisionSchema.statics.findOldestRevised = function(limit, sortingOrder, callback) {
    var pipeline = [{
            $group: {
                _id: '$title',
                creationTime: {
                    $min: '$timestamp'
                }
            }
        },
        {
            $sort: { creationTime: sortingOrder }
        },
        {
            $limit: limit
        }
    ];
    return this.aggregate(pipeline).exec(callback);
}

revisionSchema.statics.findArticleList = function(callback) {
    var pipeline = [{
        '$group': {
            '_id': '$title'
        }
    }, {
        '$sort': {
            '_id': 1
        }
    }];
    return this.aggregate(pipeline).exec(callback);
}

revisionSchema.statics.findStatsByYear = function(callback) {
    var pipeline = [{
        $group: {
            _id: {
                $year: { $toDate: '$timestamp' }
            },
            anonymous: {
                $sum: {
                    $cond: [{ $eq: ['$anon', true] }, 1, 0]
                }
            },
            admin: {
                $sum: {
                    $cond: [{ $eq: ['$isAdmin', true] }, 1, 0]
                }
            },
            bot: {
                $sum: {
                    $cond: [{ $eq: ['$isBot', true] }, 1, 0]
                }
            },
            regular: {
                $sum: {
                    $cond: [{ $and: [{ $ne: ['$anon', true] }, { $ne: ['$isAdmin', true] }, { $ne: ['$isBot', true] }] }, 1, 0]
                }
            }
        }
    }, {
        $sort: {
            '_id': 1
        }
    }];
    return this.aggregate(pipeline).exec(callback);
}

revisionSchema.statics.findStatsByYearAndTitle = function(title, callback) {
    var pipeline = [{
        $match: {
            title: title
        }
    }, {
        $group: {
            _id: {
                $year: { $toDate: '$timestamp' }
            },
            anonymous: {
                $sum: {
                    $cond: [{ $eq: ['$anon', true] }, 1, 0]
                }
            },
            admin: {
                $sum: {
                    $cond: [{ $eq: ['$isAdmin', true] }, 1, 0]
                }
            },
            bot: {
                $sum: {
                    $cond: [{ $eq: ['$isBot', true] }, 1, 0]
                }
            },
            regular: {
                $sum: {
                    $cond: [{ $and: [{ $ne: ['$anon', true] }, { $ne: ['$isAdmin', true] }, { $ne: ['$isBot', true] }] }, 1, 0]
                }
            }
        }
    }, {
        $sort: {
            '_id': 1
        }
    }];
    return this.aggregate(pipeline).exec(callback);
}

//Individual Analytics module

//List all article names with number of revisions
revisionSchema.statics.titleWithRevisions = function(title, callback) {
    var titlepipeline = [{
        $match: {
            title: title
        }
    }, {
        $group: {
            _id: null,
            count: {
                $sum: 1
            }
        }
    }]
    return this.aggregate(titlepipeline).exec(callback);
}

revisionSchema.statics.perUserperArticle = function(title, author, callback) {
    var titlepipeline = [{
        '$match': {
            'title': title,
            'user': author
        }
    }, {
        '$group': {
            '_id': {
                '$year': {
                    '$toDate': '$timestamp'
                }
            },
            'count': {
                '$sum': 1
            }
        }
    }, {
        $sort: {
            '_id': 1
        }
    }];
    return this.aggregate(titlepipeline).exec(callback);
}

revisionSchema.statics.findArticlesForUser = function(user, callback) {
    var pipeline = [{
        '$match': {
            'user': user
        }
    }, {
        '$group': {
            '_id': '$title'
        }
    }];
    return this.aggregate(pipeline).exec(callback);
}

revisionSchema.statics.findtimestamps = function(title, user, callback) {
    var pipeline = [{
        '$match': {
            'user': user,
            'title': title
        }
    }, {
        '$project': {
            'timestamp': '$timestamp'
        }
    }, {
        '$sort': {
            'timestamp': -1
        }
    }]
    return this.aggregate(pipeline).exec(callback);
}


//get Latest RevisiontitleWithRevisions to check timestamp
revisionSchema.statics.findTitleLatestRev = function(title, callback) {
    return this.find({ 'title': title })
        .sort({ 'timestamp': -1 })
        .limit(1)
        .exec(callback)
}

//get Latest RevisiontitleWithRevisions to check timestamp
revisionSchema.statics.findDistinctUsers = function(title, callback) {
    var pipeline = [{
        '$match': {
            'anon': {
                '$exists': false
            }
        }
    }, {
        '$group': {
            '_id': '$user'
        }
    }];
    return this.aggregate(pipeline).exec(callback)
}

//Display top 5 users of the selected article
revisionSchema.statics.findTopUsers = function(title1, callback) {
    var topuserspipeline = [
        { '$match': { title: title1 } }, //gets title value from the dropdown
        { '$group': { '_id': "$user", 'numOfEdits': { $sum: 1 } } },
        { '$sort': { numOfEdits: -1 } },
        { '$limit': 5 }
    ];
    return this.aggregate(topuserspipeline).exec(callback)
}


//Regular users  of the selected article
revisionSchema.statics.articleRegularUser = function(title1, callback) {
    var reguserspipeline = [{
            $match: {
                isBot: { $exists: false },
                anon: { $exists: false }
            }
        },
        {
            $group: {
                _id: {
                    title: { $trim: { input: '$title' } },
                    user: { $trim: { input: '$user' } }
                }
            }
        },
        {
            $group: {
                _id: '$_id.title',
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: 1
            }
        },
        {
            $limit: 5
        }
    ];
    return this.aggregate(reguserspipeline).exec(callback)
}

//Article statistics based on the year
revisionSchema.statics.yearlyStatics = function(title1, callback) {
    var yearpipeline = [{
            $match: { title: '$title' }
        }, {
            $group: {
                _id: {
                    $year: { $toDate: '$timestamp' }
                },
                anonymous: {
                    $sum: {
                        $cond: [{ $eq: ['$anon', true] }, 1, 0]
                    }
                },
                admin: {
                    $sum: {
                        $cond: [{ $eq: ['$isAdmin', true] }, 1, 0]
                    }
                },
                bot: {
                    $sum: {
                        $cond: [{ $eq: ['$isBot', true] }, 1, 0]
                    }
                },
                regular: {
                    $sum: {
                        $cond: [{ $and: [{ $ne: ['$anon', true] }, { $ne: ['$isAdmin', true] }, { $ne: ['$isBot', true] }] }, 1, 0]
                    }
                }
            }
        },
        {
            $sort: {
                '_id': 1
            }

        }
    ];



    return this.aggregate(yearpipeline).exec(callback)

}

revisionSchema.statics.findStatsPieChart = function(callback) {
    var pipeline = [{
        '$group': {
            '_id': null,
            'anonymous': {
                '$sum': {
                    '$cond': [{
                        '$eq': [
                            '$anon', true
                        ]
                    }, 1, 0]
                }
            },
            'admin': {
                '$sum': {
                    '$cond': [{
                        '$eq': [
                            '$isAdmin', true
                        ]
                    }, 1, 0]
                }
            },
            'bot': {
                '$sum': {
                    '$cond': [{
                        '$eq': [
                            '$isBot', true
                        ]
                    }, 1, 0]
                }
            },
            'regular': {
                '$sum': {
                    '$cond': [{
                        '$and': [{
                            '$ne': [
                                '$anon', true
                            ]
                        }, {
                            '$ne': [
                                '$isAdmin', true
                            ]
                        }, {
                            '$ne': [
                                '$isBot', true
                            ]
                        }]
                    }, 1, 0]
                }
            }
        }
    }];
    return this.aggregate(pipeline).exec(callback);
}

revisionSchema.statics.findStatsPieChartIndividual = function(title, callback) {
    var pipeline = [{
        $match: {
            title: title
        }
    }, {
        '$group': {
            '_id': null,
            'anonymous': {
                '$sum': {
                    '$cond': [{
                        '$eq': [
                            '$anon', true
                        ]
                    }, 1, 0]
                }
            },
            'admin': {
                '$sum': {
                    '$cond': [{
                        '$eq': [
                            '$isAdmin', true
                        ]
                    }, 1, 0]
                }
            },
            'bot': {
                '$sum': {
                    '$cond': [{
                        '$eq': [
                            '$isBot', true
                        ]
                    }, 1, 0]
                }
            },
            'regular': {
                '$sum': {
                    '$cond': [{
                        '$and': [{
                            '$ne': [
                                '$anon', true
                            ]
                        }, {
                            '$ne': [
                                '$isAdmin', true
                            ]
                        }, {
                            '$ne': [
                                '$isBot', true
                            ]
                        }]
                    }, 1, 0]
                }
            }
        }
    }];
    return this.aggregate(pipeline).exec(callback);
}

revisionSchema.statics.updateAuthorsList = function(callback) {
    var pipeline = [{
        '$match': {
            'anon': {
                '$exists': false
            }
        }
    }, {
        '$group': {
            '_id': '$user'
        }
    }];
    return this.aggregate(pipeline).exec(callback);
    /* var stringJson = JSON.stringify(jsonContent);
    console.log("Here" + stringJson);
    fs.writeFile("../authors.json", stringJson, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved")
    }); */
}

var revision = mongoose.model("revision", revisionSchema, "revisions");


//update user type in bson documents for analytics
function updateUserType(path, type) {
    var userArray = [];
    fs.readFileSync(path, "utf-8").split("\n").forEach(userName => {
        userArray.push(userName.trim());
    })
    if (type.indexOf("admin") > -1) {
        revision.updateMany({ user: { $in: userArray } }, { $set: { isAdmin: true } }, function(err, results) {
            if (err) {
                console.log(err);
            }
        })
    } else if (type.indexOf("bot") > -1) {
        revision.updateMany({ user: { $in: userArray } }, { $set: { isBot: true } }, function(err, results) {
            if (err) {
                console.log(err);
            }
        })
    }
}



updateUserType("./administrators.txt", "admin");
updateUserType("./bots.txt", "bot");
revision.updateAuthorsList().then(result => {
    fs.writeFile("authors.json", JSON.stringify(result), 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved")
    });
});

module.exports = revision;