'use strict';
var conversationApp = (function () {
    var settings = {
        authorTypes: {
            user: 'user',
            watson: 'watson'
        }
    };

    var chatBot;

    return {
        init: init,
        inputKeyDown: inputKeyDown,
        sendRequest: sendRequest
    };

    function init() {

        chatBot = chat;
        chatBot.init();

        updateChat();
        Api.sendRequest('', null);

        //setupInputBox();
    }

    function updateChat() {
        var currentRequestPayloadSetter = Api.setRequestPayload;
        Api.setRequestPayload = function (newPayloadStr) {
            currentRequestPayloadSetter.call(Api, newPayloadStr);
            displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.user);
        };

        var currentResponsePayloadSetter = Api.setResponsePayload;
        Api.setResponsePayload = function (newPayloadStr) {
            currentResponsePayloadSetter.call(Api, newPayloadStr);
            displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.watson);
        };
    }

    function displayMessage(newPayload, typeValue) {
        if (typeValue === settings.authorTypes.watson) {
            chatBot.recieveMessage(newPayload.output.text[0]);
        } else if (typeValue === settings.authorTypes.user) {
            chatBot.sendMessage(newPayload.input.text);
        }
    }

    function inputKeyDown(event, inputBox) {
        // Submit on enter key, dis-allowing blank messages
        if (event.keyCode === 13) {
            sendRequest(inputBox)
            if (event.preventDefault) event.preventDefault();
        }
    }

    function sendRequest(inputBox) {

        if(!inputBox.value)
            return;

        // Retrieve the context from the previous server response
        var context;
        var latestResponse = Api.getResponsePayload();
        if (latestResponse) {
            context = latestResponse.context;
        }

        // Send the user message
        Api.sendRequest(inputBox.value, context);

        inputBox.value = '';
    }
} ());