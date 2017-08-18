/**
 * Created by gmalu on 8/17/17.
 */

'use strict';
//=====================================================================================================*/

var SKILL_NAME = "Wiki";
var welcomeOutput = "Welcome to Wiki. Say something like Wiki San Francisco, or Who is Elon Musk, or Look up Aesthetic.";
var welcomeReprompt = "Just say something like Wiki Chicago, or Look up Cricket, or Stop";
var STOP_MESSAGE = "Goodbye!";
var speechOutput;

//=======================================================================================================

var Alexa = require('alexa-sdk');
var request = require("request");

var appId = "amzn1.ask.skill.bb90bf1c-6cda-40fc-b160-f8681f8128c4";

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.application.applicationId !== appId) {
            context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

var onSessionStarted = function onSessionStarted(sessionStartedRequest, session) {

}

var onLaunch = function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

var onSessionEnded  = function onSessionEnded(sessionEndedRequest, session) {
    buildSpeechletResponseWithoutCard(STOP_MESSAGE, "", true);
}

var onIntent = function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == "WikiSearchIntent") {
        handleWikiSearchIntent(intentRequest, session, callback);
    } else if (intentName == 'AMAZON.HelpIntent') {
        handleHelpIntent(intentRequest, session, callback);
    } else if (intentName == 'AMAZON.CancelIntent' || intentName == 'AMAZON.StopIntent') {
        handleCancelIntent(intentRequest, session, callback);
    }
}

var getWelcomeResponse = function getWelcomeResponse(callback) {
    //this.emit(':ask', welcomeOutput, welcomeReprompt);
    var speechOutput = welcomeOutput;

    var reprompt = welcomeReprompt;

    var header = SKILL_NAME;

    var shouldEndSession = false;

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}

var handleWikiSearchIntent = function handleWikiSearchIntent(intentRequest, session, callback) {

    console.log("Entering handleWikiSearchIntent");
    var speechOutput = "We have an error"

    getSearchTerm(intentRequest, function(sq){
        console.log("Search term: " + sq);
        searchWiki(sq, function(data) {
            console.log ("completed wikiGet");
            console.log(data);
            if (data != "ERROR") {
                var speechOutput = data
            }
            //callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, "", true))
            callback(session.attributes, buildSpeechletResponse(sq, speechOutput, "", true))
        } );
    });

}

var handleHelpIntent = function handleHelpIntent(intentRequest, session, callback) {
    callback(session.attributes, buildSpeechletResponseWithoutCard(welcomeOutput, welcomeReprompt, false));
}

var handleCancelIntent = function handleCancelIntent(intentRequest, session, callback) {
    callback(session.attributes, buildSpeechletResponseWithoutCard(STOP_MESSAGE, "", true));
}

var getSearchTerm = function getSearchTerm (intentRequest, callback){

    var searchTerm = "";
    var slots = intentRequest.intent.slots;

    for (const key in slots){
        if (slots.hasOwnProperty(key)){
            var slot = slots[key];
            if (slot && slot.value) {
                searchTerm = slot.value;
                break;
            }
        }
    }

    //console.log("search term: " + searchTerm);
    callback(toTitleCase(searchTerm));
};

var searchWiki = function searchWiki (sq, callback) {
    var wikiSearchURL = "https://en.wikipedia.org/w/api.php" +
        "?action=query" +
        '&prop=extracts' +
        '&exintro' +
        '&explaintext' +
        '&format=json' +
        '&exsentences=2' +
        '&titles=' +
        sq;

    console.log("GET: " + wikiSearchURL);

    getWikiResponse(sq, wikiSearchURL, callback);

};

var getWikiResponse = function getWikiResponse(sq, wikiSearchURL, callback){
    request.get(wikiSearchURL, function(error, response, result) {
        var data = JSON.parse(result);
        console.log("Wiki Response:" + JSON.stringify(data, undefined, 2));

        var extract = getValueByRecursion(data, "extract");
        if (extract.length > 0 && isBadResponse(extract)){
            speechOutput = 'I could not find an exact ' + sq  + '. Can you try again with a specific search?';
            callback(speechOutput);
        } else if (extract.length > 0){
            callback(removeFirstBraces(extract));
        } else {
            speechOutput = 'I was unable to find ' + sq  + '. Please try another search';
            callback(speechOutput);
        }
    });
}

var getValueByRecursion = function getValueByRecursionF (dataJson, matchKey){
    if (dataJson.hasOwnProperty(matchKey)){
        return dataJson[matchKey];
    }
    for (const key in dataJson) {
        if (dataJson.hasOwnProperty(key) && dataJson[key] instanceof Object) {
            const retVal = getValueByRecursionF(dataJson[key], matchKey);
            if (retVal){
                return retVal;
            }
        }
    }
    return "";
};

var buildSpeechletResponse = function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

var buildSpeechletResponseWithoutCard = function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

var buildResponse = function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

var toTitleCase = function toTitleCase(str) {
    return str.replace(/\w*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
}

var isBadResponse = function isBadResponse(dataStr){
    var badStr = "may refer to:";
    return dataStr.endsWith(badStr);
};

var removeFirstBraces = function removeFirstBraces(st){
    return st.replace(/^(.*?)\(.*?\)/, '$1');
}