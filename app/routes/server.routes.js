var express = require("express");
var controller = require("../controllers/server.controller");
var auth = require("../controllers/auth.controller");
var router = express.Router();
var { verifyUserDetails } = require("../middleware")
var { authToken } = require("../middleware")

// Initial page
router.post("/register", [
        verifyUserDetails.checkDuplicateUsernameOrEmail
    ],
    auth.register
); //For registration page
router.post("/login", auth.login); //For login

//Overall analytics queries
router.get(
    "/overallAnalytics/findMostRevised/limit/:limit/sortingOrder/:sortOrder",
    controller.findMostRevised
);
router.get(
    "/overallAnalytics/findUniqueUsersCount/limit/:limit/sortingOrder/:sortOrder",
    controller.findUniqueUsersCount
);
router.get(
    "/overallAnalytics/findArticleHistory/limit/:limit/sortingOrder/:sortOrder",
    controller.findArticleHistory
);
router.get("/overallAnalytics/findStatsByYear", controller.findStatsByYear);

router.get("/individualAnalytics/getLatest", controller.getLatest);
router.get("/individualAnalytics/findTopUsers/:title", controller.findTop);
router.get("/individualAnalytics/articleRegUsers", controller.findArticleRegUsers);
router.get("/individualAnalytics/articleYearlyStats", controller.findArticleYearStats);
router.get("/individualAnalytics/redditArticles", controller.getRedditArticles);
router.get("/getArticleList", controller.findArticleList);
router.get("/overallAnalytics/findStatsPieChart", controller.findStatsPieChart);

router.get("/individualAnalytics/titleWithRevisions/:title", controller.titleWithRevisions);
router.get("/individualAnalytics/findStatsByYearAndTitle/:title", controller.findStatsByYearAndTitle);
router.get("/individualAnalytics/findStatsPieChartIndividual/:title", controller.findStatsPieChartIndividual);
router.get("/individualAnalytics/perUserperArticle/title/:title/author/:author", controller.perUserperArticle);

router.get("/authorAnalytics/findDistinctUsers", controller.findDistinctUsers);

router.get("/individualAnalytics/findTitleLatestRev/:title", controller.findTitleLatestRev);
router.get("/updateDb/:title/:timestamp/:revid", controller.updateDb)

router.get("/authorAnalytics/:user", controller.findArticlesForUser);

router.get("/authorAnalytics/findtimestamps/:title/:user", controller.findTimeStampForArticle)

module.exports = router;