/**
 * Created by gmalu on 8/13/17.
 */

'use strict';
// Wiki =====================================================================================================*/


var SKILL_NAME = "Wiki";
var welcomeOutput = "Welcome to Wiki. Just say Wiki San Francisco or Wiki anything.";
var welcomeReprompt = "Welcome to Wiki. Just say Wiki San Francisco or Wiki anything.";
var STOP_MESSAGE = "Goodbye!";
var speechOutput;


// 2. Skill Code =======================================================================================================

var https = require('https');
var Alexa = require('alexa-sdk');

var appId = "amzn1.ask.skill.bb90bf1c-6cda-40fc-b160-f8681f8128c4";

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', welcomeOutput, welcomeReprompt);
    },
    'WikiSearchIntent': function () {
        //var sT = getSearchTerm();
        var speechOutput = "cricket";
        searchWiki("Cricket", speechOutput);
        this.emit(':tell', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', welcomeOutput, welcomeReprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
};

exports.handler = (event, context) => {
    console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    if (event.session.application.applicationId !== appId) {
        context.fail("Invalid Application ID");
    }

    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

var getSearchTerm = function getSearchTerm (){
    //Now let's recap the trip
    var actor= isSlotValid(this.event.request, "actor");
    var artist= isSlotValid(this.event.request, "artist");
    var country= isSlotValid(this.event.request, "country");
    var city= isSlotValid(this.event.request, "city");

    var searchTerm = "";
    if (actor){
        searchTerm = actor;
    } else if (artist){
        searchTerm = artist;
    } else if (country){
        searchTerm = country;
    } else if (city) {
        searchTerm = city;
    }
    return searchTerm;
};

var isSlotValid = function isSlotValid (request, slotName){
    var slot = request.intent.slots[slotName];
    console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase(); //TODO Camel case
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
};

var searchWiki = function searchWiki (sq){
    var wikiOutput = wikiGET(sq, function (output){
        //$("#output").text(output);
        console.log(output);
        speechOutput = output;
    });
};

var wikiGET = function wikiGET (sq, callback) {
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

    https.get(wikiSearchURL, function(result){
        console.log(JSON.stringify(result, undefined, 2));
        console.log(result);
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            console.log(JSON.stringify(chunk, undefined, 2));
            console.log(chunk);
            var extract = getValueByRecursion(chunk, "extract");
            callback(extract);
        });
    }).on('error', function (e) {
        speechOutput = 'I was unable to find ' + sq + ' ' + '. Please try another search';
        console.log(speechOutput);

    });


    console.log('different try: ' + wikiSearchURL);
    https.get(wikiSearchURL, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            console.log(d);
        });

    }).on('error', (e) => {
        console.error(e);
        console.log(e);
    });

};

var getValueByRecursion = function getValueByRecursionF (dataJson, matchKey){
    if (dataJson.hasOwnProperty(matchKey)){
        return dataJson[matchKey];
    }

    for (const key in dataJson) {
        if (dataJson.hasOwnProperty(key) && dataJson[key] instanceof Object) {
            /*
             console.log();
             console.log(key + '->')
             console.log(JSON.stringify(dataJson[key], undefined, 2));
             console.log();
             */
            const retVal = getValueByRecursionF(dataJson[key], matchKey);
            if (retVal){
                return retVal;
            }
        }
    }
    return "";
};

//=========================================================================================================================================
