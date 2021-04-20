"use strict";
const config = require('../config');                        // Load the config
const async = require('async');                             // Async Library
const express = require('express');                         // Express
const router = express.Router();                            //
const _ = require('underscore');                            // Underscore Library
const app = require('../app');
const jwt_decode = require('jwt-decode');
const mqtt = app.mqtt;
const mqttsub = app.mqttsub;
// MQTT 
var countMirdc = 0;
let countBySub = 0;
mqttsub.on("connect", function () {
    console.log("[MQTTSUB]:", "Connected.");
    // mqtt.subscribe(config.topic, { qos: 0 }, function (err, granted) {
    //     // if (!err) {
    //     //     console.log(granted[0].topic, granted[0].qos);
    //     // }


    // });
});
mqttsub.on("message", function (topic, msg) {
    var messagesubJSON = JSON.parse(msg.toString());
    var token = messagesubJSON.ssotoken.EIToken;
    var decoded = jwt_decode(token);
    let BaseData = '{"userId":"' + decoded.userId + '"' + ',"username":"' + decoded.username + '"' +
        ',"firstName":"' + decoded.firstName + '"' +
        ',"lastName":"' + decoded.lastName + '"';
    if (_.isNull(decoded.country) || _.isUndefined(decoded.country)) {
        BaseData = BaseData + ',"country":"TW"' + ',"role":"' + decoded.role + '"';
    } else {
        BaseData = BaseData + ',"country":"' + decoded.country + '"' + ',"role":"' + decoded.role + '"';
    }
    var url = messagesubJSON.redirecturl;
    console.log("url: " + url)
    if (url === "https://www.wind-shear.org:30001") {
        BaseData = BaseData + ',"AppName":"ss1"';
        console.log("ss1");
    } else if (url === "https://sfactorymodelwebui.iii-cflab.com/") {
        BaseData = BaseData + ',"AppName":"sa1"';
        console.log("sa1");
    } else if (url === "https://s1sunkheadwebui.wise-paas.com/") {
        BaseData = BaseData + ',"AppName":"sd1"';
        console.log("sd1");
    } else if (url === "https://s1modulewebui.iii-cflab.com/") {
        BaseData = BaseData + ',"AppName":"sd2"';
        console.log("sd2")
    } else if (url === "http://fastener.sfactory.org/FastenerCloud/") {
        BaseData = BaseData + ',"AppName":"sv1"';
        console.log("sv1");
    } else {
        BaseData = BaseData + ',"AppName":"unknown"';
        console.log("hu");
    }
    let CountData = BaseData +
        ',"Type":"Count"' +
        ',"CountName":"APInumber"';
    countMirdc = 1;
    CountData = CountData + ',"Count":"' + countMirdc + '"}';
    console.log("CountData: " + CountData);
    // publish("mirdc/metering/data", CountData, options);
    if (mqtt.connected) {
        mqtt.publish("mirdc/metering/data", CountData, mqtt.options, function (err) {
            if (!err) {
                console.log("success");
            } else {
                console.error("fail");
            }
        });
    }

    let AccumulationTimeData = BaseData +
        ',"Type":"AccumulationTime"';
    var randomVar = Math.floor(Math.random() * 151) + 300;
    AccumulationTimeData = AccumulationTimeData + ',"Time":"' + randomVar + '"}';

    if (mqtt.connected) {
        mqtt.publish("mirdc/metering/data", AccumulationTimeData, mqtt.options, function (err) {
            if (!err) {
                console.log("success");
            } else {
                console.error("fail");
            }
        });
    }

    var randomStartEndTime = Math.floor(Math.random() * 2);
    let RecordTimeData = null;
    if (randomStartEndTime == 0) {
        RecordTimeData = BaseData +
            ',"Type":"RecordTime"' +
            ',"RecordType":"End"' +
            ',"LongestTime":"600"}';
    } else {
        RecordTimeData = BaseData +
            ',"Type":"RecordTime"' +
            ',"RecordType":"Start"' +
            ',"LongestTime":"600"}';
    }
    if (mqtt.connected) {
        mqtt.publish("mirdc/metering/data", RecordTimeData, mqtt.options, function (err) {
            if (!err) {
                console.log("success");
            } else {
                console.error("fail");
            }
        });
    }
});
// mqtt.on("connect", function () { 
mqtt.on("connect", function () {
    console.log("[MQTT]:", "Connected.");
    let count = 0;
    let topic = process.env.topic || config.topic;
    let options = {
        qos: 0
    };
    let duration = 2000;
    let timer_id = setInterval(function () {

        var randomVar = Math.floor(Math.random() * 5);
        console.log("randomVar: " + randomVar + " " + duration);
        //flag ==1 means that payload will send (key)(value) "SSOToken":"ey...."
        var flag = 0;
        if (flag == 0) {
            // let BaseData = "";
            // var randomVarUsername = Math.floor(Math.random() * 6);
            // if (randomVarUsername == 0) {
            //     BaseData = BaseData + '{"userId":"f6e98537-18b7-4c7b-8581-111111111111"';
            //     BaseData = BaseData + ',"username":"smp-test-1@iii.org.tw"';
            // } else if (randomVarUsername == 1) {
            //     BaseData = BaseData + '{"userId":"f6e98537-18b7-4c7b-8581-222222222222"';
            //     BaseData = BaseData + ',"username":"smp-test-2@iii.org.tw"';
            // } else if (randomVarUsername == 2) {
            //     BaseData = BaseData + '{"userId":"f6e98537-18b7-4c7b-8581-333333333333"';
            //     BaseData = BaseData + ',"username":"smp-test-3@iii.org.tw"';
            // } else if (randomVarUsername == 3) {
            //     BaseData = BaseData + '{"userId":"f6e98537-18b7-4c7b-8581-444444444444"';
            //     BaseData = BaseData + ',"username":"smp-test-4@iii.org.tw"';
            // } else if (randomVarUsername == 4) {
            //     BaseData = BaseData + '{"userId":"f6e98537-18b7-4c7b-8581-555555555555"';
            //     BaseData = BaseData + ',"username":"smp-test-5@iii.org.tw"';
            // } else if (randomVarUsername == 5) {
            //     BaseData = BaseData + '{"userId":"f6e98537-18b7-4c7b-8581-666666666666"';
            //     BaseData = BaseData + ',"username":"smp-test-6@iii.org.tw"';
            // }
            // var randomVarDeviceName = Math.floor(Math.random() * 6);
            // if (randomVarDeviceName == 0) {
            //     BaseData = BaseData +
            //         ',"deviceName":"device1"' +
            //         ',"deviceId":"1"';
            // } else if (randomVarDeviceName == 1) {
            //     BaseData = BaseData +
            //         ',"deviceName":"device2"' +
            //         ',"deviceId":"2"';
            // } else if (randomVarDeviceName == 2) {
            //     BaseData = BaseData +
            //         ',"deviceName":"device3"' +
            //         ',"deviceId":"3"';
            // } else if (randomVarDeviceName == 3) {
            //     BaseData = BaseData +
            //         ',"deviceName":"device4"' +
            //         ',"deviceId":"4"';
            // } else if (randomVarDeviceName == 4) {
            //     BaseData = BaseData +
            //         ',"deviceName":"device5"' +
            //         ',"deviceId":"5"';
            // } else if (randomVarDeviceName == 5) {
            //     BaseData = BaseData +
            //         ',"deviceName":"device6"' +
            //         ',"deviceId":"6"';
            // }
            // var randomVarAppName = Math.floor(Math.random() * 8);
            // let SubscriptionData = "";
            // let CountData = "";
            // let AccumulationTimeData = "";
            // switch (randomVarAppName) {
            //     case 0:
            //         BaseData = BaseData + ',"AppName":"Collision Detection Software"';
            //         BaseData = BaseData + ',"AppId":"1679091c5a880faf6fb5e6087eb1b2dc"';
            //         SubscriptionData = BaseData + ',"Type":"subscription"';
            //         var randomYear = Math.floor(Math.random() * 4) + 2019;
            //         var randomMonth = Math.floor(Math.random() * 12) + 1;
            //         SubscriptionData = SubscriptionData + ',"year":"' + randomYear + '"';
            //         SubscriptionData = SubscriptionData + ',"month":"' + randomMonth + '"}';
            //         publish(topic, SubscriptionData, options);
            //         break;
            //     case 1:
            //         BaseData = BaseData + ',"AppName":"iCAM"';
            //         BaseData = BaseData + ',"AppId":"8f14e45fceea167a5a36dedd4bea2543"';
            //         CountData = BaseData + ',"Type":"count"' + ',"CountName":"APInumber"';
            //         var randomVar = Math.floor(Math.random() * 5) + 1;
            //         CountData = CountData + ',"Count":"' + randomVar + '"}';
            //         publish(topic, CountData, options);
            //         break;
            //     case 2:
            //         BaseData = BaseData + ',"AppName":"Singal Acquisition"';
            //         BaseData = BaseData + ',"AppId":"c9f0f895fb98ab9159f51fd0297e236d"';
            //         AccumulationTimeData = BaseData +
            //             ',"Type":"time"';
            //         var randomVar = (Math.floor(Math.random() * 5)) * 3600;
            //         AccumulationTimeData = AccumulationTimeData + ',"Time":"' + randomVar + '"}';
            //         publish(topic, AccumulationTimeData, options);
            //         break;
            //     case 3:
            //         BaseData = BaseData + ',"AppName":"Automated Data Collection"';
            //         BaseData = BaseData + ',"AppId":"45c48cce2e2d7fbdea1afc51c7c6ad26"';
            //         SubscriptionData = BaseData + ',"Type":"subscription"';
            //         var randomYear = Math.floor(Math.random() * 4) + 2019;
            //         var randomMonth = Math.floor(Math.random() * 12) + 1;
            //         SubscriptionData = SubscriptionData + ',"year":"' + randomYear + '"';
            //         SubscriptionData = SubscriptionData + ',"month":"' + randomMonth + '"}';
            //         publish(topic, SubscriptionData, options);
            //         break;
            //     case 4:
            //         BaseData = BaseData + ',"AppName":"Suppress Warpage Optimization"';
            //         BaseData = BaseData + ',"AppId":"d3d9446802a44259755d38e6d163e820"';
            //         CountData = BaseData +
            //             ',"Type":"count"' +
            //             ',"CountName":"APInumber"';
            //         var randomVar = Math.floor(Math.random() * 5) + 1;
            //         CountData = CountData + ',"Count":"' + randomVar + '"}';
            //         publish(topic, CountData, options);
            //         break;
            //     case 5:
            //         BaseData = BaseData + ',"AppName":"OPCUA"';
            //         BaseData = BaseData + ',"AppId":"6512bd43d9caa6e02c990b0a82652dca"';
            //         AccumulationTimeData = BaseData +
            //             ',"Type":"time"';
            //         var randomVar = (Math.floor(Math.random() * 5)) * 3600;
            //         AccumulationTimeData = AccumulationTimeData + ',"Time":"' + randomVar + '"}';
            //         publish(topic, AccumulationTimeData, options);
            //         break;
            //     case 6:
            //         BaseData = BaseData + ',"AppName":"ADS"';
            //         BaseData = BaseData + ',"AppId":"c20ad4d76fe97759aa27a0c99bff6710"';
            //         SubscriptionData = BaseData + ',"Type":"subscription"';
            //         var randomYear = Math.floor(Math.random() * 4) + 2019;
            //         var randomMonth = Math.floor(Math.random() * 12) + 1;
            //         SubscriptionData = SubscriptionData + ',"year":"' + randomYear + '"';
            //         SubscriptionData = SubscriptionData + ',"month":"' + randomMonth + '"}';
            //         publish(topic, SubscriptionData, options);
            //         break;
            //     case 7:
            //         BaseData = BaseData + ',"AppName":"Milling Path Analysis"';
            //         BaseData = BaseData + ',"AppId":"c51ce410c124a10e0db5e4b97fc2af39"';
            //         CountData = BaseData +
            //             ',"Type":"count"' +
            //             ',"CountName":"APInumber"';
            //         var randomVar = Math.floor(Math.random() * 5) + 1;
            //         CountData = CountData + ',"Count":"' + randomVar + '"}';
            //         publish(topic, CountData, options);
            //         break;
            // }

            //#################################################
            let BaseData = "";
            var randomVarUsername = Math.floor(Math.random() * 2);
            if (randomVarUsername == 0) {
                BaseData = BaseData + '{"userId":"imtc.d300@hotmail.com"';
                BaseData = BaseData + ',"username":"imtc.d300"';
            } else if (randomVarUsername == 1) {
                BaseData = BaseData + '{"userId":"cathy.chen@itri.org.tw"';
                BaseData = BaseData + ',"username":"Cathy"';
            } else if (randomVarUsername == 2) {
                BaseData = BaseData + '{"userId":"PNWang@itri.org.tw"';
                BaseData = BaseData + ',"username":"PNWang"';
            }
            var randomVarDeviceName = Math.floor(Math.random() * 2);
            if (randomVarDeviceName == 0) {
                BaseData = BaseData +
                    ',"deviceName":"68-0A40571-01"' +
                    ',"deviceId":"3B42EA4B86CEC7C39A2C051A5DB8371B"';
            } else if (randomVarDeviceName == 1) {
                BaseData = BaseData +
                    ',"deviceName":"DESKTOP-QSLG4F2"' +
                    ',"deviceId":"E3B3D13ADAB443D64E800CA88B06FC8F"';
            } else if (randomVarDeviceName == 2) {
                BaseData = BaseData +
                    ',"deviceName":"DESKTOP-2N8SNHP"' +
                    ',"deviceId":"CE28053126F3791B18F4CEB38BB59386"';
            }
            var randomVarAppName = Math.floor(Math.random() * 2);
            let SubscriptionData = "";
            let CountData = "";
            let AccumulationTimeData = "";
            switch (randomVarAppName) {
                case 0:
                    BaseData = BaseData + ',"AppName":"Metering API Test Tool"';
                    BaseData = BaseData + ',"AppId":"meteringapitesttool0000000000001"';
                    CountData = BaseData + ',"Type":"count"' + ',"CountName":"APInumber"';
                    var randomVar = Math.floor(Math.random() * 5) + 1;
                    CountData = CountData + ',"Count":"' + randomVar + '"}';
                    publish(topic, CountData, options);
                    break;
                case 1:
                    BaseData = BaseData + ',"AppName":"VMX Availability factor Visual website"';
                    BaseData = BaseData + ',"AppId":"vmxutsystemweb"';
                    CountData = BaseData + ',"Type":"count"' + ',"CountName":"APInumber"';
                    var randomVar = Math.floor(Math.random() * 5) + 1;
                    CountData = CountData + ',"Count":"' + randomVar + '"}';
                    publish(topic, CountData, options);
                    break;
                case 2:
                    BaseData = BaseData + ',"AppName":"Notepad"';
                    BaseData = BaseData + ',"AppId":"notepadsampleapp"';
                    AccumulationTimeData = BaseData +
                        ',"Type":"time"';
                    var randomVar = (Math.floor(Math.random() * 5)) * 3600;
                    AccumulationTimeData = AccumulationTimeData + ',"Time":"' + randomVar + '"}';
                    publish(topic, AccumulationTimeData, options);
                    break;
            }


        } else if (flag == 1) {
            let BaseData = '{"SSOToken":"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJXSVNFLVBhYVNAaWlpLWNmbGFiLmNvbSIsImlhdCI6MTU2NzQwODc3MywiZXhwIjoxNTY3NDEyMzczLCJ1c2VySWQiOiIwYmUyYjU1NC1kN2IyLTQ2NTYtYjEyNy1kMDhkYTlhZmZiZjkiLCJ1YWFJZCI6Ijk5MWIyZWUzLWU5ZjMtNDJlZi05YjJjLTJhMzM4NmM2OWYxZiIsImNyZWF0aW9uVGltZSI6MTU1NDcyOTQ2ODAwMCwibGFzdE1vZGlmaWVkVGltZSI6MTU1NDc3ODgzNTAwMCwidXNlcm5hbWUiOiJlaXBhYXNzc29yb290QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IlNpZ24gT24iLCJsYXN0TmFtZSI6IlNpbmdsZSIsInJvbGUiOiJhZG1pbiIsImdyb3VwcyI6WyJlaXBhYXNzc29yb290QGdtYWlsLmNvbSJdLCJjZlNjb3BlcyI6W3siZ3VpZCI6bnVsbCwic3NvX3JvbGUiOiJhZG1pbiIsInNwYWNlcyI6W119XSwic2NvcGVzIjpbXSwic3RhdHVzIjoiYWN0aXZlIiwib3JpZ2luIjoiU1NPIiwib3ZlclBhZGRpbmciOmZhbHNlLCJzeXN0ZW0iOmZhbHNlLCJyZWZyZXNoVG9rZW4iOiJiM2ViZDVmZS04ZmY0LTQ5NDktYWQxNy0wMjUwNDMxZDY5ZTgifQ.-v3igxHyb7jFglMHTV9U_Shg3CHmj2oUfq-iAM3sKilyKZj_qToN_IJ1yROirwk-HOp_tmRNiE6bURJzcJcHQQ"' +
                ',"country":"TW"';
            var randomVar2 = Math.floor(Math.random() * 3);

            if (randomVar2 == 0) {
                BaseData = BaseData + ',"AppName":"Metal fastener"';
            } else if (randomVar2 == 1) {
                BaseData = BaseData + ',"AppName":"Production Visualization"';
            } else {
                BaseData = BaseData + ',"AppName":"Forging"';
            }
            if (randomVar == 0) {
                let CountData = BaseData +
                    ',"Type":"count"' +
                    ',"CountName":"APInumber"';
                var randomVar = Math.floor(Math.random() * 20) + 1;
                CountData = CountData + ',"Count":"' + randomVar + '"}';
                publish(topic, CountData, options);
            } else if (randomVar == 1) {
                let AccumulationTimeData = BaseData +
                    ',"Type":"time"';
                var randomVar = Math.floor(Math.random() * 151) + 300;
                AccumulationTimeData = AccumulationTimeData + ',"Time":"' + randomVar + '"}';
                publish(topic, AccumulationTimeData, options);
            } else {
                let AccumulationTimeData = BaseData +
                    ',"Type":"subscribe"';
                var randomVar = Math.floor(Math.random() * 151) + 300;
                AccumulationTimeData = AccumulationTimeData + ',"Time":"' + randomVar + '"}';
                publish(topic, AccumulationTimeData, options);
            }
        }
        // '{"d":{"WISE4010-7W28A9":{' + 
        //         '"W4010-28A9_Fz1Volt" : ' + (Math.random()*100).toFixed(2) + ',' +
        //         '"W4010-28A9_Fz1Temp" : ' + (Math.random()*100).toFixed(2) +
        //         '}}, "ts":"2019-04-13T00:19:19+08:00"}';
    }, duration);
    // mqtt.subscribe(topic);
    function publish(topic, msg, options) {
        if (mqtt.connected && count <= 100000) {
            mqtt.publish(topic, msg, options, function (err) {
                if (!err) {
                    console.log(count++);
                } else {
                    console.error(count++);
                }
            });
        }
    };
});

mqtt.on("message", function (topic, data) {
    // console.log(JSON.parse(data.toString()));
});

mqtt.on("close", function () {
    console.error("[MQTT]: Disconnected.");
});

mqtt.on("reconnect", function () {
    console.error("[MQTT]: Reconnect.");
});

mqtt.on("error", function (err) {
    console.error("[MQTT]:" + err.stack);
});

module.exports = router;