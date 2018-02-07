/**
 * Created by gmalu on 8/14/17.
 */
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */
var http = require('http');
// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
         if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
         context.fail("Invalid Application ID");
         }
         */
        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
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
/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}
/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}
/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);
    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
    // Dispatch to your skill's intent handlers
    if("WelcomeIntent" === intentName) {
        getWelcomeResponse(callback);
    }
    if ("ReadBookChapterVerseIntent" === intentName) {
        ReadBookChapterVerse(intent, session, callback);
    } else if ("ReadNextVerseIntent" === intentName) {
        ReadNextVerse(intent, session, callback);
    } else if ("RandomScriptureMasteryIntent" === intentName) {
        ReadRandomScriptureMastery(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}
/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}
// --------------- Functions that control the skill's behavior -----------------------
function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Gospel Library";
    var speechOutput = "Welcome to the Gospel Library Reader. " +
        "Please ask me to tell you a verse by saying, Read 1st Nephi 3 verse 7 ";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please ask me to tell you a verse by saying, Read 1st Nephi 3 verse 7";
    var shouldEndSession = false;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for using the Gospel Library Reader.";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}
/**s
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function ReadBookChapterVerse(intent, session, callback) {
    var cardTitle = "Scripture";
    var bookSlot = intent.slots.book;
    var chapterSlot = intent.slots.chapter;
    var startVerseSlot = intent.slots.startVerse;
    var endVerseSlot = intent.slots.endVerse;
    var repromptText = "";
    var shouldEndSession = false;
    var speechOutput = "";
    if (bookSlot && bookSlot.value && chapterSlot && chapterSlot.value && startVerseSlot && startVerseSlot.value) {
        var book = bookSlot.value;
        book = book.substr(0, 1).toUpperCase() + book.substr(1);
        var chapter = chapterSlot.value;
        var startVerse = startVerseSlot.value;
        var endVerse;
        if (endVerseSlot && endVerseSlot.value) {
            endVerse = endVerseSlot.value;
        }
        else {
            endVerse = startVerse;
        }
        sendWebRequest(book, chapter, startVerse, endVerse, cardTitle, callback);
    } else {
        speechOutput = 'I was unable to find your verse. This is a work in progress please try again';
        repromptText = "I'm not sure what verse you wanted. . Please ask me to tell you a verse by saying, Read 1st Nephi 3 verse 7";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}
function ReadNextVerse(intent, session, callback) {
    var cardTitle = "Scripture";
    var startVerseSlot = intent.slots.startVerse;
    var endVerseSlot = intent.slots.endVerse;
    var book;
    var chapter;
    var startVerse;
    var endVerse;
    //restore session attributes
    if (session.attributes) {
        book = session.attributes.book;
        chapter = session.attributes.chapter;
        startVerse = parseInt(session.attributes.currentVerse) + 1;
    }
    //override startVerse if slot value exists
    if (startVerseSlot && startVerseSlot.value)
        startVerse = startVerseSlot.value;
    //set endVerse if exists
    if (endVerseSlot && endVerseSlot.value) {
        endVerse = endVerseSlot.value;
    }
    else {
        endVerse = startVerse;
    }
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    if (book && chapter && startVerse) {
        sendWebRequest(book, chapter, startVerse, endVerse, cardTitle, callback)
    }
    else {
        speechOutput = 'I was unable to find your book and chapter. This is a work in progress please try again';
        repromptText = "I'm not sure what verse you wanted. . Please ask me to tell you a verse by saying, Read 1st Nephi 3 verse 7";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}
function ReadRandomScriptureMastery(intent, session, callback) {
    var cardTitle = 'Scripture Mastery';
    var result = getScriptureMasteryVerse();
    var book = result.book;
    var chapter = result.chapter;
    var startVerse = result.startVerse;
    var endVerse = result.endVerse;
    if (!endVerse)
    {
        endVerse = startVerse;
    }
    var repromptText = null;
    var sessionAttributes = createCurrentVerseAttributes(book, chapter, endVerse);
    var shouldEndSession = false;
    var speechOutput = "";
    if (book && chapter && startVerse) {
        sendWebRequest(book, chapter, startVerse, endVerse, cardTitle, callback)
    }
    else {
        speechOutput = 'I failed to get the scripture mastery. This is a work in progress please try again';
        repromptText = "I am unable to read your scripture mastery. . Please ask me to tell you a verse by saying, Read 1st Nephi 3 verse 7";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}
function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Gospel Library";
    var speechOutput = "You can ask to hear a verse by saying. Read 1st Nephi 3 verse 7 or by saying Read Matthew 1 verse 7 to the Gospel Library Reader. " +
        "For a list of scriptures visit www.lds.org/scriptures";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please ask me to tell you a verse by saying, Read 1st Nephi 3 verse 7";
    var shouldEndSession = false;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
function sendWebRequest(inBook, chapter, startVerse, endVerse, cardTitle, callback)
{
    var _this = this;
    var sessionAttributes = {};
    var book = resolveBook(inBook);
    sessionAttributes = createCurrentVerseAttributes(book, chapter, endVerse);
    var url = 'http://bomapi-happycloud.rhcloud.com/v1/verses/' + book + '/' + chapter + '/' + startVerse + '/' + endVerse;
    console.log("Requesting: " + url);
    http.get(url, function(res){
        res.setEncoding('utf8');
        res.on('data', function(chunk){
            var resultArray;
            if(chunk)
                resultArray = JSON.parse('' + chunk);
            else
                _this.console.log('Unable to resolve web request to happycloud.')
            if(resultArray)
                _this.console.log('array ' + resultArray + " length: " + resultArray.length);
            var scriptureResult = '';
            if(resultArray)
                for (var i = 0; i < resultArray.length; i++) {
                    _this.console.log(i + ' ' + resultArray[i]);
                    scriptureResult = scriptureResult + " " + resultArray[i].book_title + " " + resultArray[i].chapter_number + ":" + resultArray[i].verse_number + " " + resultArray[i].scripture_text;
                }
            repromptText = "Please ask me to tell you a verse by saying, Read 1st Nephi 3 verse 7";
            if(scriptureResult)
            {
                speechOutput = scriptureResult;
                callback(sessionAttributes,
                    buildNextSpeechletResponse(cardTitle, speechOutput, repromptText, false));
            }
            else
            {
                speechOutput = 'I was unable to find ' + book + ' ' + chapter + ':' + startVerse + '. Please try another scripture';
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
            }
        });
    }).on('error', function (e) {
        speechOutput = 'I was unable to find ' + book + ' ' + chapter + ':' + startVerse + '. Please try another scripture';
        repromptText = 'Please ask me to tell you a verse by saying, Read 1st Nephi 3 verse 7';
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
    });
}
function createCurrentVerseAttributes(book, chapter, currentVerse) {
    return {
        book: books,
        chapter: chapter,
        currentVerse: currentVerse
    };
}
function trimNumbers(book)
{
    if(!isNaN(book.charAt(0)))
    {
        if(book.indexOf('1st') > -1 || book.indexOf('2nd') > -1 || book.indexOf('3rd') > -1 || book.indexOf('4th') > -1)
            book = book.slice(0,1) + book.slice(3, book.length);
    }
    return book
}
function resolveBook(book) {
    var bookLowerCase = book.toLowerCase();
    var bookLowerCase = trimNumbers(bookLowerCase);
    var collection = [
        {key: '1 nephi', value: '1 Nephi'},
        {key: '2 nephi', value: '2 Nephi'},
        {key: 'jacob', value: 'Jacob'},
        {key: 'enos', value: 'Enos'},
        {key: 'jarom', value: 'Jarom'},
        {key: 'omni', value: 'Omni'},
        {key: 'word', value: 'Words of Mormon'},
        {key: 'mosiah', value: 'Mosiah'},
        {key: 'alma', value: 'Alma'},
        {key: 'helaman', value: 'Helaman'},
        {key: '3 nephi', value: '3 Nephi'},
        {key: '4 nephi', value: '4 Nephi'},
        {key: 'mormon', value: 'Mormon'},
        {key: 'ether', value: 'Ether'},
        {key: 'moroni', value: 'Moroni'},
        {key: 'exodus', value: 'Exodus'},
        {key: 'leviticus', value: 'Leviticus'},
        {key: 'number', value: 'Numbers'},
        {key: 'deuter', value: 'Deuteronomy'},
        {key: 'joshua', value: 'Joshua'},
        {key: 'judge', value: 'Judges'},
        {key: 'ruth', value: 'Ruth'},
        {key: '1 sam', value: '1 Samuel'},
        {key: '2 sam', value: '2 Samuel'},
        {key: '1 kin', value: '1 Kings'},
        {key: '2 kin', value: '2 Kings'},
        {key: '1 chr', value: '1 Chronicles'},
        {key: '2 chr', value: '2 Chronicles'},
        {key: 'ezra', value: 'Ezra'},
        {key: 'nehem', value: 'Nehemiah'},
        {key: 'esth', value: 'Esther'},
        {key: 'job', value: 'Job'},
        {key: 'psalm', value: 'Psalms'},
        {key: 'proverb', value: 'Proverbs'},
        {key: 'ecclesi', value: 'Ecclesiastes'},
        {key: 'solomon', value: 'Song of Solomon'},
        {key: 'isaiah', value: 'Isaiah'},
        {key: 'jerem', value: 'Jeremiah'},
        {key: 'lament', value: 'Lamentations'},
        {key: 'ezek', value: 'Ezekiel'},
        {key: 'dan', value: 'Daniel'},
        {key: 'hos', value: 'Hosea'},
        {key: 'joe', value: 'Joel'},
        {key: 'amo', value: 'Amos'},
        {key: 'obad', value: 'Obadiah'},
        {key: 'jona', value: 'Jonah'},
        {key: 'mica', value: 'Micah'},
        {key: 'nahu', value: 'Nahum'},
        {key: 'habakk', value: 'Habakkuk'},
        {key: 'zephan', value: 'Zephaniah'},
        {key: 'haggai', value: 'Haggai'},
        {key: 'zech', value: 'Zechariah'},
        {key: 'malac', value: 'Malachi'},
        {key: 'matthew', value: 'Matthew'},
        {key: 'mark', value: 'Mark'},
        {key: 'luke', value: 'Luke'},
        //{key: 'john', value: 'John'},
        {key: 'act', value: 'Acts'},
        {key: 'roman', value: 'Romans'},
        {key: '1 cor', value: '1 Corinthians'},
        {key: '2 cor', value: '2 Corinthians'},
        {key: 'gal', value: 'Galatians'},
        {key: 'eph', value: 'Ephesians'},
        {key: 'phil', value: 'Philippians'},
        {key: 'colo', value: 'Colossians'},
        {key: '1 thes', value: '1 Thessalonians'},
        {key: '2 thes', value: '2 Thessalonians'},
        {key: '1 tim', value: '1 Timothy'},
        {key: '2 tim', value: '2 Timothy'},
        {key: 'titus', value: 'Titus'},
        {key: 'phil', value: 'Philemon'},
        {key: 'hebr', value: 'Hebrews'},
        {key: 'jame', value: 'James'},
        {key: '1 pet', value: '1 Peter'},
        {key: '2 pet', value: '2 Peter'},
        {key: '1 john', value: '1 John'},
        {key: '2 john', value: '2 John'},
        {key: '3 john', value: '3 John'},
        {key: 'john', value: 'John'}, //moved john lower to match cases where there is 1 2 3 john
        {key: 'jude', value: 'Jude'},
        {key: 'revelation', value: 'Revelation'},
        {key: 'dc', value: 'Doctrine and Covenants'},
        {key: 'doctrine', value: 'Doctrine and Covenants'}
    ];
    console.log("Attempting to match: " + bookLowerCase);
    for(var x = 0 ; x < collection.length; x++)
    {
        if(bookLowerCase.indexOf(collection[x].key) > -1)
        {
            console.log("Found: " + collection[x].key + " " + collection[x].value);
            return collection[x].value;
        }
    }
    return book;
}
function getScriptureMasteryVerse()
{
    var collection = [
        {book: '1 Nephi', chapter: 3, startVerse: 7},
        {book: '1 Nephi', chapter: 19, startVerse:23},
        {book: '2 Nephi', chapter:  2, startVerse:25},
        {book: '2 Nephi', chapter:  2, startVerse:27},
        {book: '2 Nephi', chapter:  9, startVerse:28, endVerse: 29},
        {book: '2 Nephi', chapter:  28, startVerse:7, endVerse: 9},
        {book: '2 Nephi', chapter:  32, startVerse:3},
        {book: '2 Nephi', chapter:  32, startVerse:8, endVerse: 9},
        {book: 'Jacob', chapter:  2, startVerse:18, endVerse: 19},
        {book: 'Mosiah', chapter:  2, startVerse:17},
        {book: 'Mosiah', chapter:  3, startVerse:19},
        {book: 'Mosiah', chapter:  4, startVerse:30},
        {book: 'Alma', chapter:  32, startVerse:21},
        {book: 'Alma', chapter:  34, startVerse:32, endVerse: 34},
        {book: 'Alma', chapter:  37, startVerse:6, endVerse: 7},
        {book: 'Alma', chapter:  37, startVerse:35},
        {book: 'Alma', chapter:  41, startVerse:10},
        {book: 'Helaman', chapter:  5, startVerse:12},
        //{book: '3 Nephi', chapter:  11, startVerse:29},
        //{book: '3 Nephi', chapter:  27, startVerse:27},
        {book: 'Ether', chapter:  12, startVerse:6},
        {book: 'Ether', chapter:  12, startVerse:27},
        {book: 'Moroni', chapter:  7, startVerse:16, endVerse: 17},
        {book: 'Moroni', chapter:  7, startVerse:45},
        {book: 'Moroni', chapter:  10, startVerse:4, endVerse: 5}
    ];
    return collection[Math.round(Math.random() * (collection.length - 1))];
}
function buildNextSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output  + " To continue Say next verse"
        },
        card: {
            type: "Simple",
            title: "Gospel Library - " + title,
            content: "" + output
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
// --------------- Helpers that build all of the responses -----------------------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "Gospel Library - " + title,
            content: "" + output
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
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
