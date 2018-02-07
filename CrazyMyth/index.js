'use strict';
var Alexa = require('alexa-sdk');

var appId = 'amzn1.ask.skill.dff18b50-55ad-480b-9a0a-7c718715b6c9';

var SKILL_NAME = "Crazy Myths";
var GET_MYTH_MESSAGE = "Here's your crazy myth: ";
var HELP_MESSAGE = "You can say tell me a crazy myth, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

var data = [
    "Mom's belly reveals baby's gender.",
    "Moms can give colds to their developing babies.",
    "Pregnant women shouldn't wear high heels.",
    "Exercise during pregnancy can strangle the baby.",
    "Skipping breakfast starves the baby.",
    "Pregnant women should avoid rock concerts.",
    "Pregnant women shouldn't dye their hair.",
    "Pregnant women shouldn't fly.",
    "Astrology can predict your personality or the future.",
    "When you call someone, the signal bounces off a satellite",
    "The Great Wall of China is the only man-made structure visible from space.",
    "Lightning never strikes the same place twice.",
    "The Earth is a perfect sphere.",
    "Mount Everest is the tallest thing on Earth.",
    "A flushed toilet rotates the other way in southern hemisphere.",
    "Albert Einstein failed mathematics.",
    "Vaccines cause autism.",
    "Alcohol kills brain cells.",
    "Tongue has different taste parts for salty, bitter, sour, sweet.",
    "Bananas grow on trees.",
    "Milk increases mucus.",
    "Shaving thickens hair.",
    "Bulls hates red color.",
    "Sleepers swallow eight spiders per year.",
    "Going past the edge of space makes you weightless.",
    "We only use 10 percent of our brains.",
    "Dropping a penny from a tall building will kill someone.",
    "Cracking your knuckles gives you arthritis.",
    "Hair and fingernails continue growing after death.",
    "It takes seven years to digest swallowed chewing gum.",
    "One human year is equivalent to seven dog years.",
    "Fortune cookies are a Chinese tradition."
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewMythIntent');
    },
    'GetNewMythIntent': function () {
        var mythArr = data;
        var mythIndex = Math.floor(Math.random() * mythArr.length);
        var randomMyth = mythArr[mythIndex];
        var speechOutput = GET_MYTH_MESSAGE + randomMyth;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomMyth)
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
