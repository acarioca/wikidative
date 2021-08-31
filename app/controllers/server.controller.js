/**
 * server.controller.js
 * 
 * This controller module exposes the following methods:
 *  - showLandingPage is used for displaying the main page
 *  - loginUser is a post method that verifies the user details before letting them log in
 *  - registerUser is a post method to handle a user's registration data
 */
var request = require('request');
var express = require('express')
var user = require('../models/user');
var revision = require('../models/revision');

function idSortOrder(sortOrder) {
    if (sortOrder.indexOf("asc") > -1) {
        return 1;
    } else if (sortOrder.indexOf("desc") > -1) {
        return -1;
    }
}
module.exports.findMostRevised = function(req, res) {
    sortingOrder = idSortOrder(req.params.sortOrder);
    revision.findMostnLeastRevised(parseInt(req.params.limit), sortingOrder).then(result =>
        res.json(result)).catch(err => console.log(err));
}

module.exports.findUniqueUsersCount = function(req, res) {
    sortingOrder = idSortOrder(req.params.sortOrder);
    revision.findRegUserRevisions(parseInt(req.params.limit), sortingOrder).then(result =>
        res.json(result)).catch(err => console.log(err));
}

module.exports.findArticleHistory = function(req, res) {
    sortingOrder = idSortOrder(req.params.sortOrder);
    revision.findOldestRevised(parseInt(req.params.limit), sortingOrder).then(result =>
        res.json(result)).catch(err => console.log(err));
}

module.exports.findStatsByYear = function(req, res) {
    revision.findStatsByYear().then(result =>
        res.json(result)).catch(err => console.log(err));
}

//latest timestamp
module.exports.getLatest = function(req, res) {
    title = req.query.title;
    console.log(title);

    revision.findTitleLatestRev(title, function(err, result) {
        if (err) {
            console.log("Cannot find " + title + ",s latest revision!")
        } else {
            // console.log(result)
            revision = result[0];
            console.log(revision);
            //res.render('revision.pug',{title: title, revision:revision})
        }
    })
}

//Find top 5 users for the selected article
module.exports.findTop = function(req, res) {
    revision.findTopUsers(req.params.title).then(result => {
        return res.json(result);
    }).catch(err => console.log(err));
}

//Author dropdown
module.exports.authordropdown = function(req, res) {

    Revision.getAuthordetails(function(err, result) {

    })
}



// Article yearly stats
module.exports.findArticleYearStats = function(req, res) {
    title = req.query.title;
    revision.yearlyStatics(function(err, result) {
        if (err) {
            console.log("Cannot find Yearly statistics")
        } else {
            res.render('revision.pug', { table: result })
        }
    })
}

//Displays article's regular users
module.exports.findArticleRegUsers = function(req, res) {
    title = req.query.title;
    revision.articleRegularUser(function(err, result) {
        if (err) {
            console.log("Cannot find Yearly statistics")
        } else {
            res.render('revision.pug', { table: result })
        }
    })
}

//Fetch Reddit article
const fetch = require("node-fetch");

function getReddit(articleName) {
    return fetch(`http://www.reddit.com/search.json?q=${articleName}&sort="relevance"&limit=5`)
        .then(res => res.json())
        .then(data => data.data.children.map(data => data.data))
        .catch(err => console.log(err));
}

var RedditArticleArray = [];
//Reddit Articles
module.exports.getRedditArticles = function(req, res) {
    title3 = req.query.title3;
    console.log(title3);

    getReddit(title3).then(results => {
            results.forEach(post => {

                const image = post.preview ? post.preview.images[0]
                    .source.url :
                    'https://cdn.slashgear.com/wp-content/uploads/2019/09/reddit_logo_main-1280x720.jpg';

                let output = `Image: "${image}" + Title: ${post.title} + Subbreddit: ${post.subbreddit} + Score: ${post.score}`;

                RedditArticleArray = output;
                console.log(output);
            })
        })
        //res.render('analytic.pug', RedditArticleArray);

}

module.exports.findArticleList = function(req, res) {
    revision.findArticleList().then(result =>
        res.json(result)).catch(err => console.log(err));
}

module.exports.findStatsPieChart = function(req, res) {
    revision.findStatsPieChart().then(result =>
        res.json(result)).catch(err => console.log(err));
}

module.exports.titleWithRevisions = function(req, res) {
    revision.titleWithRevisions(req.params.title).then(result => {
        return res.json(result);
    }).catch(err => console.log(err));
}

module.exports.findStatsByYearAndTitle = function(req, res) {
    revision.findStatsByYearAndTitle(req.params.title).then(result => {
        return res.json(result);
    }).catch(err => console.log(err));
}

module.exports.findStatsPieChartIndividual = function(req, res) {
    revision.findStatsPieChartIndividual(req.params.title).then(result => {
        return res.json(result);
    }).catch(err => console.log(err));
}

module.exports.perUserperArticle = function(req, res) {
    revision.perUserperArticle(req.params.title, req.params.author).then(result => {
        return res.json(result);
    }).catch(err => console.log(err));
}

module.exports.findDistinctUsers = function(req, res) {
    revision.findDistinctUsers().then(result => {
        return res.json(result);
    }).catch(err => console.log(err));
}

module.exports.findTitleLatestRev = function(req, res) {
    revision.findTitleLatestRev(req.params.title).then(result => {
        return res.json(result);
    }).
    catch(err => console.log(err));
}

module.exports.findArticlesForUser = function(req, res) {
    revision.findArticlesForUser(req.params.user).then(result => {
        return res.json(result);
    }).catch(err => console.log(err));
}

module.exports.findTimeStampForArticle = function(req, res) {
    revision.findtimestamps(req.params.title, req.params.user).then(result => {
        return res.json(result);
    }).catch(err => console.log(err));
}


module.exports.updateDb = function(req1, res1) {
    console.log("Upating records for " + req1.params.title);
    var wikiEndpoint = "https://en.wikipedia.org/w/api.php";
    var parameters = [
        "rvdir=newer",
        "action=query",
        "prop=revisions",
        "rvlimit=500",
        "rvprop=ids|flags|user|userid|timestamp",
        "formatversion=2",
        "format=json"
    ]

    var url = wikiEndpoint + "?" + parameters.join("&");
    var tempUrl = new URL(url);
    tempUrl.searchParams.append("titles", req1.params.title);
    tempUrl.searchParams.append("rvstart", req1.params.timestamp);
    console.log("url: " + tempUrl);

    var options = {
        url: tempUrl,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };
    request(options, function(err, res, data) {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Error status code:', res.statusCode);
        } else {
            var json = JSON.parse(data);
            var pages = json.query.pages;
            let docTitle = pages[Object.keys(pages)[0]].title;
            revisions = pages[Object.keys(pages)[0]].revisions
            console.log(revisions);
            for (rev in revisions) {
                let revid = revisions[rev].revid;
                let user = revisions[rev].user;
                let anon = revisions[rev].user ? true : false;
                let timestamp = revisions[rev].timestamp;

                if (revid != req1.params.revid) {
                    let newRevision = new revision({
                        title: docTitle,
                        user: user,
                        revid: revid,
                        timestamp: timestamp,
                        anon: anon
                    });
                    newRevision.save((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Document created successfully");
                        }
                    })
                }
            }
        }
    });
}