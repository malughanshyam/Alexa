/**
 * Created by gmalu on 8/13/17.
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
    wikiOutput = wikiGET(sq);
}


function wikiGET(sq) {
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
        $("#data").text(result);
        console.log(result);
        extract = ""
        extract = getValueByRecursion(result, "extract")
        spitOutput(extract);

        /*
        $.each(result, function(i, field){
            $("#data").append(field);
            console.log("i" + i);
            console.log(field);
        });
        */
    });
}

function spitOutput(output){
    $("#output").text(output);
}


//-------- Helper function ------- //
function getValueByRecursion(dataJson, matchKey){
    if (dataJson.hasOwnProperty(matchKey)){
        //console.log(dataJson[matchKey]);
        return dataJson[matchKey];
    }

    for (var key in dataJson) {
        if (dataJson.hasOwnProperty(key) && dataJson[key] instanceof Object) {
            //console.log(key + '->' + dataJson[key]);
            return getValueByRecursion(dataJson[key], matchKey);
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






