'use strict';

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will var us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8888;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    next();
});

router.route('/cockney').get(function (req, res) {
    res.status(200);
    res.json({});
}).post(bodyParser.urlencoded({extended: true}), function (req, res) {
    var VERIFY_TOKEN = process.env.SLACK_KEY;

    if (req.body.token !== VERIFY_TOKEN) {
        res.status(401);
        res.json({message: 'Not welcome here bro'});
    } else {
        var searchString = req.body.text.split(' ').join('+');
        var words = req.body.text.split(' ');
        var cockney = {
            'arm': ['chalk'],
            'arse': ['bottle and glass'],
            'believe': ['Adam and Eve'],
            'bottle': ['aris'],
            'cash': ['bees and honey', 'sausage and mash'],
            'curry': ['ruby murray', 'ruby'],
            'dead': ['brown bread'],
            'face': ['boat race'],
            'hair': ['barnet'],
            'head': ['loaf', 'crust'],
            'knickers': ['city slickers'],
            'laugh': ['bubble'],
            'look': ['butchers', 'butchers hook'],
            'mate': ['me china', 'me china plate', 'me mucker'],
            'money': ['bees and honey', 'sausage and mash'],
            'mistake': ['cadburys flake'],
            'phone': ['dog n bone', 'dog', 'bone'],
            'pissed': ['brahms and liszt'],
            'stairs': ['apple and pairs', 'wooden hill', 'tables and chairs'],
            'suit': ['whistle and flute', 'whistle', 'flute'],
            'sun': ['current bun'],
            'tea': ['rosie', 'rosie lee'],
            'trouble': ['barney rubble'],
            'upstairs': ['up the apple and pairs', 'up the wooden hill', 'up the tables and chairs'],
            'walk': ['ball of chalk'],
            'wife': ['trouble and strife']
        };
        var message = '';

        words.forEach(function (word) {
            var translations;

            word = word.replace(/\W/g, '');
            translations = cockney[word];

            if (translations) {
                var randomResponseIndex = Math.floor(Math.random() * translations.length);

                message += translations[randomResponseIndex];
            } else {
                message += word;
            }

            message += ' ';
        });

        res.json({
            response_type: 'in_channel',
            token: VERIFY_TOKEN,
            attachments: [{
                text: message
            }]
        })
    }
});

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
