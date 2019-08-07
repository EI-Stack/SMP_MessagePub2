"use strict";
const config        = require('../config');                         // Load the config
const async         = require('async');                             // Async Library
const express       = require('express');                           // Express
const router        = express.Router();
const _             = require('underscore');                        // Underscore Library
const app           = require('../app');
const mqtt          = app.mqtt;

// MQTT 
mqtt.on("connect", function () {    
    console.log("[MQTT]:", "Connected.");
    let count    = 0;
    let topic    = process.env.topic || config.topic;
    let options  = {
        qos     : 0
    };
    let duration = 1000;
    let timer_id = setInterval( function(){
        let data =  '{"d":{"WISE4010-7W28A9":{' + 
                '"W4010-28A9_Fz1Volt" : ' + (Math.random()*100).toFixed(2) + ',' +
                '"W4010-28A9_Fz1Temp" : ' + (Math.random()*100).toFixed(2) +
                '}}, "ts":"2019-04-13T00:19:19+08:00"}';
        publish(topic, data, options);
    }, duration);
    // mqtt.subscribe(topic);
    function publish(topic, msg, options){
        if (mqtt.connected && count<=100000){
            mqtt.publish(topic, msg, options, function(err){
                if (!err) {
                    console.log(count ++);
                } else {
                    console.error(count ++);
                }
            });
        }
    };    
});

mqtt.on("message", function (topic, data) {
    // console.log(JSON.parse(data.toString()));
});

mqtt.on("close", function() {
    console.error("[MQTT]: Disconnected.");
});

mqtt.on("reconnect", function() {
    console.error("[MQTT]: Reconnect.");
});

mqtt.on("error", function(err) {
    console.error("[MQTT]:" + err.stack);
});

module.exports = router;