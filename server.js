'use strict';

// BASE SETUP
// =============================================================================

// call the packages we need
let express = require('express');        // call express
let app = express();                 // define our app using express
let bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8888;        // set our port

// ROUTES FOR OUR API
// =============================================================================
let router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    next();
});

router.route('/').get(function (req, res) {
    res.sendStatus(200)
}).post(bodyParser.urlencoded({extended: true}), function (req, res) {
    let VERIFY_TOKEN = process.env.SLACK_KEY;

    if (req.body.token !== VERIFY_TOKEN) {
        return res.sendStatus(401);
    }

    let searchString = req.body.text.split(' ').join('+');
    let words = req.body.text.split(' ');
    let cockney = {
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
    let message = '';

    words.forEach(function (word) {
        let translations;

        word = word.replace(/\W/g, '');
        translations = cockney[word];

        if (translations) {
            let randomResponseIndex = Math.floor(Math.random() * translations.length);

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
});

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
