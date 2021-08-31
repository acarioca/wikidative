var client = require("./connection");
var jsonfile = require('jsonfile');
// ping the client to be sure Elasticsearch is up
client.ping({
    requestTimeout: 30000,
}, function(error) {
    // at this point, eastic search is down, please check your Elasticsearch service
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});



// require the array of authors that was downloaded
const authors = require('./authors.json');
// declare an empty array called bulk
var bulk = [];
//loop through each author and create and push two objects into the array in each loop
//first object sends the index and type you will be saving the data as
//second object is the data you want to index
authors.forEach(author => {
        bulk.push({
            index: {
                _index: "author-list",
                _type: "authors_list",
            }
        })
        bulk.push(author)
    })
    //perform bulk indexing of the data passed
console.log(bulk)
client.bulk({ body: bulk }, function(err, response) {
    if (err) {
        console.log("Failed Bulk operation".red, err)
    } else {
        console.log("test");
        console.log("Successfully imported %s", authors.length);
    }
});

const bulkIndex = function bulkIndex(index, type, data) {
    let bulkBody = [];
    for (let i = 0; i < data.length; i++) {
        bulkBody.push({
            index: {
                _index: index,
                _type: type,
            }
        });
        bulkBody.push(data[i]);

    }
    client.bulk({ body: bulkBody }).then(response => {
        console.log("here");
        let errorCount = 0;
        response.items.forEach(item => {
            if (item.index && item.index.error) {
                console.log(item.index.error);
            }
        });
        console.log("Successfully indexed");
    }).catch(console.err);
};

const test = function test() {
    const articlesRaw = jsonfile.readFileSync("./authors.json");
    bulkIndex('bulkimport', 'bulkdoc', articlesRaw);
}
test();