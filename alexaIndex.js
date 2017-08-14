/**
 * Created by gmalu on 8/13/17.
 */

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.bb90bf1c-6cda-40fc-b160-f8681f8128c4";


var SKILL_NAME = "Wiki";
var HELP_MESSAGE = "You can say Wiki Heath Ledger, or, Wiki with a topic name or you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================

//=========================================================================================================================================
/*var data = ({"batchcomplete":"","query":{"pages":{"17173785":{"pageid":17173785,"ns":0,"title":"Heath Ledger","extract":"Heathcliff Andrew Ledger (4 April 1979 \u2013 22 January 2008) was an Australian actor and director. After performing roles in several Australian television and film productions during the 1990s, Ledger left for the United States in 1998 to develop his film career. His work comprised nineteen films, including 10 Things I Hate About You (1999), The Patriot (2000), A Knight's Tale (2001), Monster's Ball (2001), Lords of Dogtown (2005), Brokeback Mountain (2005), The Dark Knight (2008), and The Imaginarium of Doctor Parnassus (2009), the latter two being posthumous releases. He also produced and directed music videos and aspired to be a film director."}}}});
*/

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

    return $.getJSON(wikiSearchURL, function(result){
        console.log("wikiSearchURL result:");
        console.log(result);

        var extract = getValueByRecursion(result, "extract")
        spitOutput(extract);
    });
}

function spitOutput(output){
    $("#output").text(output);
}

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

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('WikiSearchIntent');
    },
    'WikiSearchIntent': function () {
        var factArr = data;



        var speechOutput = GET_FACT_MESSAGE + randomFact;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};



