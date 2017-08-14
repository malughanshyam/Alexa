/**
 * Created by gmalu on 8/13/17.
 */


/*

Handle Ambiguous topics
 https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&exsentences=4&titles=Alexa&callback=?

 Exsentences should ignore /n

 */
$( document ).ready(function() {

    $("#sqBtn").click(function(){
        searchWiki();
    });

    $("#sqInput").on('keyup', function (e) {
        if (e.keyCode == 13) {
            $("#sqBtn").click();
        }
    });

});

function searchWiki(){
    sq = $('#sqInput').val();
    wikiOutput = wikiGET(sq, function (output){
        //console.log("Output:" + output)
        $("#output").text(output);
    });
}

function wikiGET(sq, callback) {
    var wikiSearchURL = "https://en.wikipedia.org/w/api.php" +
        "?action=query" +
        '&prop=extracts' +
        '&exintro' +
        '&explaintext' +
        '&format=json' +
        '&exsentences=4' +
        '&titles=' +
        sq +
        '&callback=?';

    console.log("GET: " + wikiSearchURL);
    $("#URL").text(wikiSearchURL);

    $.getJSON(wikiSearchURL, function(result){
        $("#data").text(JSON.stringify(result, undefined, 2));
        //console.log(result);
        extract = getValueByRecursion(result, "extract")
        callback(extract);
    });
}

function getValueByRecursion(dataJson, matchKey){
    if (dataJson.hasOwnProperty(matchKey)){
        return dataJson[matchKey];
    }

    for (var key in dataJson) {
        if (dataJson.hasOwnProperty(key) && dataJson[key] instanceof Object) {
            /*
            console.log();
            console.log(key + '->')
            console.log(JSON.stringify(dataJson[key], undefined, 2));
            console.log();
            */
            retVal = getValueByRecursion(dataJson[key], matchKey);
            if (retVal){
                return retVal;
            }
        }
    }
    return "";

}

function testGet(sq) {
    var url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&exsentences=4';
    url += '&titles=' + sq;

    var http = require('https');
    var options = {
        host: url,
        port: 80,
        path: '/',
        agent: false
    };

    http.get(options, function (res) {
        console.log("Response: " + res.statusCode);
        console.log(res.statusCode);
    }).on('error', function (e) {
        console.log("Error message: " + e.message);
    });

}

function testData(){
    var data = `{
    "batchcomplete": "",
        "query": {
        "pages": {
            "19376355": {
                "pageid": 19376355,
                    "ns": 0,
                    "title": "Ganesha",
                    "extract": "Ganesha (; Sanskrit: गणेश, Gaṇeśa;  listen ), also known as Ganapati, Vinayaka and Binayak, is one of the best-known and most worshiped deities in the Hindu pantheon. His image is found throughout India, Sri Lanka, Thailand and Nepal. Hindu sects worship him regardless of affiliations. Devotion to Ganesha is widely diffused and extends to Jains and Buddhists."
            }
        }
    }
}`;

    /*
     $("#data").text(data);
     dataJson = JSON.parse(data);
     output = getValueByRecursion(dataJson, "extract");

     //$("#output").text(output);
     //console.log(output);

     //sq = "Ganesha";
     //testGet(sq)
     */
}



function testParser(){
    t1 = {"t11":"vt11", "t12":"vt12"};
    t2 = {"t21":"vt21", "t22":"vt22"}
    t={"n":t1, "p":t2}

    t = `{
        "normalized": [
        {
            "from": "cricket",
            "to": "Cricket"
        }
    ],
        "pages": {
        "25675557": {
            "pageid": 25675557,
                "ns": 0,
                "title": "Cricket",
                "extract": "Cricket is a bat-and-ball game played between two teams of eleven players each on a cricket field, at the centre of which is a rectangular 22-yard-long pitch with a target called the wicket (a set of three wooden stumps topped by two bails) at each end. Each phase of play is called an innings during which one team bats, attempting to score as many runs as possible, whilst their opponents field. Depending on the type of match, the teams have one or two innings apiece and, when the first innings ends, the teams swap roles for the next innings. Except in matches which result in a draw, the winning team is the one that scores the most runs, including any extras gained."
        }
    }
    }`;

    t = JSON.parse(t);
    console.log(JSON.stringify(t, undefined, 2))
    console.log(getValueByRecursion(t,"extract"));
}



