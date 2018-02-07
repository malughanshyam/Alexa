'use strict';
var Alexa = require('alexa-sdk');

var appId = 'amzn1.ask.skill.eaeced56-a26c-40dc-a460-3cee463a4fcb';

var SKILL_NAME = "Drinking Facts";
var GET_DRINKING_FACT_MESSAGE = "Here's a drinking fact: ";
var HELP_MESSAGE = "You can say tell me a drinking fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

var data = [
    "It only takes 6 minutes for brain cells to react to alcohol.",
    "Alcohol is not digested; it gets absorbed directly into the bloodstream.",
    "Alcohol kills one person every 10 seconds worldwide.",
    "About one-third of designated drivers have at least one drink while carrying the title.",
    "Alcohol doesn't make you forget anything. When you get blackout drunk, the brain temporarily loses the ability to create memories.",
    "Each Russian consumes 18 litres (4.8 US gallons) of alcohol per year, doubling what experts consider dangerous.",
    "There are over 500,000 alcohol-related deaths in Russia each year.",
    "People with blue eyes have a higher alcohol tolerance.",
    "Over 30% of cancer could be prevented by avoiding tobacco and alcohol, having a healthy diet and physical activity.",
    "Beer was not considered an alcoholic beverage in Russia until 2013.",
    "The strongest beer in the world has a 67.5% alcohol content.",
    "In the U.K., it is legal for kids over 5 years old to drink alcohol at home or on other private premises.",
    "Amsterdam pays alcoholics in beer to clean streets: 5 cans of beer for a day's work, plus €10 and tobacco.",
    "The U.S. government poisoned alcohol during Prohibition in the 20s and 30s, killing over 10,000 people.",
    "Alcohol Poisoning Kills 6 Americans Every Day.",
    "In professional shooting, Alcohol is considered to be a performance-enhancing drug because it relaxes you and slows your heart rate enough to give you an edge.",
    "In late 19th-Century, millions of American children learned in school that just one taste of alcohol could lead to blindness, madness or even spontaneous combustion.",
    "The highest blood alcohol content ever recorded was .91%, more than twice the typical lethal limit and eleven times more than legally drunk.",
    "There's a cruise ship that runs between Stockholm, Sweden, and Helsinki, Finland, just to purchase cheap alcohol.",
    "Sigmund Freud recommended Cocaine as treatment for depression, alcoholism, and morphine addiction.",
    "Alcohol is prohibited in the UK Parliament with one exception: the chancellor can drink while delivering the annual budget statement.",
    "People drink more slowly when alcohol is served in straight-sided glasses than when it's served in glasses with curved sides, a research found.",
    "31% of rock star deaths are related to drugs or alcohol.",
    "During prohibition, the U.S. Congress had their own bootlegger so senators and congressmen could still drink alcohol.",
    "1 in 5 top 100 country songs will refer to alcohol.",
    "Giving up Alcohol for just one month can improve liver function, decrease blood pressure and reduce the risk of liver disease and diabetes.",
    "Alexander the Great once held a drinking contest among his soldiers. When it was over, 42 people had died from alcohol poisoning.",
    "The top 10% of American alcohol consumers ingest about 10 drinks per day.",
    "The peak blood alcohol concentration level can be 3 times higher in people who drink with an empty stomach than in those who had a meal before drinking.",
    "As a rule of thumb, darker and bitter beers have higher alcohol content.",
    "About 50% of Asians have trouble metabolizing alcohol due to a missing liver enzyme needed to process it.",
    "3.5% of cancer deaths worldwide are attributable to the consumption of alcohol. The World Health Organization has classified alcohol as a Group 1 carcinogen.",
    "By cutting down on alcohol, keeping a healthy bodyweight, and exercising, you can reduce the risk of cancer by 30%.",
    "The founder of Alcoholics Anonymous demanded alcohol during the last few days of his life.",
    "Alcohol consumed with food is absorbed more slowly, because it spends a longer time in the stomach.",
    "Coffee has been found to reverse liver damage caused by alcohol.",
    "13 people died of alcohol poisoning in 1875 in Ireland when a brewery caught fire causing whiskey to flow through the streets.",
    "Comet Lovejoy released as much alcohol as the amount found in 500 bottles of wine every second during its peak activity."
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewDrinkingFactIntent');
    },
    'GetNewDrinkingFactIntent': function () {
        var factArr = data;
        var factIndex = Math.floor(Math.random() * factArr.length);
        var randomFact = factArr[factIndex];
        var speechOutput = GET_DRINKING_FACT_MESSAGE + randomFact;
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

