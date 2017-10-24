/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

'use strict';

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// parser for post requests
var bodyParser = require('body-parser');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// watson sdk
var watson = require('watson-developer-cloud');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static('./public'));
app.use(bodyParser.json());

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Create the service wrapper
var conversation = watson.conversation({
  url: 'https://gateway.watsonplatform.net/conversation/api',
  username: '69fe3569-6612-487d-a8a9-1a8d1803dac2',
  password: '01aynR6DRaEO',
  version_date: '2016-07-11',
  version: 'v1'
});

// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
  var workspace = '56165310-700c-4f61-a296-84da04e50b52';

  var payload = {
    workspace_id: workspace,
    context: {},
    input: {}
  };

  if (req.body) {
    if (req.body.input) {
      payload.input = req.body.input;
    }
    if (req.body.context) {
      // The client must maintain context/state
      payload.context = req.body.context;
    }
  }
  // Send the input to the conversation service
  conversation.message(payload, function (err, data) {
    if (err) {
      console.log(err);
      return res.status(err.code || 500).json(err);
    }
    return res.json(updateMessage(payload, data));
  });
});

function updateMessage(input, response) {
  var responseText = null;
  var id = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  if (logs) {
    // If the logs db is set, then we want to record all input and responses
    id = uuid.v4();
    logs.insert({ '_id': id, 'request': input, 'response': response, 'time': new Date() });
  }
  return response;
}

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

module.exports = app;
