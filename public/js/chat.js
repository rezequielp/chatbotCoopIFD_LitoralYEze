'use strict';
var chat = (function () {

    var $input = $('#input');
    var $send = $('#send');
    var $content = $('#content');
    var $inner = $('#inner');

    var messageList = [];

    return {
        init: init,
        sendMessage: sendMessage,
        recieveMessage: recieveMessage
    };

    function init() {
        $input.focus();
        /*$send.on('click', function (e) {
            sendMessage();
        });
        $input.on('keydown', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) {
                e.preventDefault();
                sendMessage();
            }
        });*/
    }

    function sendMessage(message) {
        var message = {
            user: this.me,
            text: message,
            time: new Date().getTime()
        };
        messageList.push(message);

        $content.append(buildHtml(message.text, 'me'));
        safeText(message.text);
        animateText();
        scrollBottom();
    }

    function recieveMessage(message) {
        var message = {
            user: this.them,
            text: message,
            time: new Date().getTime()
        };
        messageList.push(message);

        $content.append(buildHtml(message.text, 'them'));
        safeText(message.text);
        animateText();
        scrollBottom();
    }

    function safeText(text) {
        $content.find('.message-wrapper').last().find('.text-wrapper').text(text);
    }

    function animateText() {
        setTimeout(function () {
            $content.find('.message-wrapper').last().find('.text-wrapper').addClass('animated fadeIn');
        }, 350);
    }

    function scrollBottom() {
        $($inner).animate({ scrollTop: $($content).offset().top + $($content).outerHeight(true) }, {
            queue: false,
            duration: 'ease'
        });
    }

    function buildHtml(text, who) {
        return '<div class="message-wrapper ' + who + '">\n              <div class="circle-wrapper animated bounceIn"></div>\n              <div class="text-wrapper">...</div>\n            </div>';
    }
} ());