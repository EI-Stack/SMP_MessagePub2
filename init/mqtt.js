"use strict";
const config        = require('../config');                         // Load the config
const async         = require('async');                             // Async Library
const express       = require('express');                           // Express
const router        = express.Router();
const _             = require('underscore');                        // Underscore Library
const app           = require('../app');
const jwt_decode    = require('jwt-decode');
const mqtt          = app.mqtt;
const mqttsub       = app.mqttsub;
// MQTT 
var countMirdc = 0;
let countBySub =0;
mqttsub.on("connect", function () {
    console.log("[MQTTSUB]:","Connected.");
    mqttsub.subscribe("mirdcfics/sso")
});
mqttsub.on("message", function (topic,msg) {
    
    var messagesubJSON = JSON.parse(msg.toString());
    var token = messagesubJSON.ssotoken.EIToken;
    var decoded = jwt_decode(token);
    let BaseData = '{"userId":"'+decoded.userId+'"' + ',"username":"'+decoded.username+'"' +
                   ',"firstName":"'+decoded.firstName+'"' +
                    ',"lastName":"'+decoded.lastName+'"';
    if(_.isNull(decoded.country)||_.isUndefined(decoded.country)){
        BaseData = BaseData+',"country":"TW"' +',"role":"'+decoded.role+'"';
    }else{
        BaseData = BaseData+',"country":"'+decoded.country+'"'+',"role":"'+decoded.role+'"';
    }
    var url = messagesubJSON.redirecturl;
    console.log("url: "+url)
    if(url==="https://www.wind-shear.org:30001"){
        BaseData =  BaseData        +   ',"AppName":"ss1"';
        console.log("ss1");
    }else if(url==="https://sfactorymodelwebui.iii-cflab.com/"){
        BaseData =  BaseData        +   ',"AppName":"sa1"';
        console.log("sa1");
    }else if(url==="https://s1sunkheadwebui.wise-paas.com/"){
        BaseData =  BaseData        +   ',"AppName":"sd1"';
        console.log("sd1");
    }else if(url==="https://s1modulewebui.iii-cflab.com/"){
        BaseData =  BaseData        +   ',"AppName":"sd2"';
        console.log("sd2")
    }else if(url==="http://fastener.sfactory.org/FastenerCloud/"){
        BaseData =  BaseData        +   ',"AppName":"sv1"';
        console.log("sv1");
    }else{
        BaseData =  BaseData        +   ',"AppName":"unknown"';
        console.log("hu");
    }
    let CountData            =   BaseData   +
    ',"Type":"Count"'           +
    ',"CountName":"APInumber"' ;
    countMirdc = 1;        
    CountData = CountData     + ',"Count":"'+countMirdc+'"}';
    console.log("CountData: "+CountData);   
    // publish("mirdc/metering/data", CountData, options);
    if (mqtt.connected){
        mqtt.publish("mirdc/metering/data", CountData, mqtt.options, function(err){
            if (!err) {
                console.log("success");
            } else {
                console.error("fail");
            }
        });
    }

    let AccumulationTimeData =   BaseData   +
                    ',"Type":"AccumulationTime"';
        var randomVar = Math.floor(Math.random()*151)+300;       
        AccumulationTimeData  =  AccumulationTimeData  + ',"Time":"'+randomVar+'"}';

    if (mqtt.connected){
        mqtt.publish("mirdc/metering/data", AccumulationTimeData, mqtt.options, function(err){
            if (!err) {
                console.log("success");
            } else {
                console.error("fail");
            }
        });
    }

    var randomStartEndTime = Math.floor(Math.random()*2);
    let RecordTimeData = null;
    if(randomStartEndTime==0){
      RecordTimeData       =   BaseData   +
                    ',"Type":"RecordTime"'      +
                    ',"RecordType":"End"'       +
                    ',"LongestTime":"600"}';
    }else{
      RecordTimeData       =   BaseData   +
                    ',"Type":"RecordTime"'      +
                    ',"RecordType":"Start"'     +
                    ',"LongestTime":"600"}';
    }
    if (mqtt.connected){
        mqtt.publish("mirdc/metering/data", RecordTimeData, mqtt.options, function(err){
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
    let count    = 0;
    let topic    = process.env.topic || config.topic;
    let options  = {
        qos     : 0
    };
    let duration =  1000;
   
    // let timer_id = setInterval( function(){

    //     var randomVar = Math.floor(Math.random()*5);
    //     console.log("randomVar: "+randomVar+" "+duration);
    //     //flag ==1 means that payload will send (key)(value) "SSOToken":"ey...."
    //     var flag=0;
    //     if(flag==0){
    //         let BaseData =  '{"userId":"f6e98537-18b7-4c7b-8581-812dc48c5c80"';
    //         var randomVarUsername = Math.floor(Math.random()*6);
    //             if(randomVarUsername==0){
    //                 BaseData = BaseData + ',"username":"ei-paas@iii.org.tw"' +
    //                 ',"firstName":"John"' +
    //                 ',"lastName":"Cena"' +
    //                 ',"country":"TW"' +
    //                 ',"role":"tenant"';
    //             }else if(randomVarUsername==1){
    //                 BaseData = BaseData + ',"username":"eipaasssoroot@iii.org.tw"' +
    //                 ',"firstName":"John"' +
    //                 ',"lastName":"Cena"' +
    //                 ',"country":"TW"' +
    //                 ',"role":"tenant"';
    //             }else if(randomVarUsername==2){
    //                 BaseData = BaseData + ',"username":"holi@iii.org.tw"' +
    //                 ',"firstName":"ho"' +
    //                 ',"lastName":"li"' +
    //                 ',"country":"TW"' +
    //                 ',"role":"srpuser"';
    //             }else if(randomVarUsername==3){
    //                 BaseData = BaseData + ',"username":"holisun@iii.org.tw"' +
    //                 ',"firstName":"holi"' +
    //                 ',"lastName":"sun"' +
    //                 ',"country":"TW"' +
    //                 ',"role":"srpuser"';
    //             }else if(randomVarUsername==4){
    //                 BaseData = BaseData + ',"username":"stevenliao@iii.org.tw"' +
    //                 ',"firstName":"liao"' +
    //                 ',"lastName":"steven"' +
    //                 ',"country":"TW"' +
    //                 ',"role":"srpuser"';
    //             }else if(randomVarUsername==5){
    //                 BaseData = BaseData + ',"username":"eipaasssoroot@gmail.com"' +
    //                 ',"firstName":"John"' +
    //                 ',"lastName":"Cena"' +
    //                 ',"country":"TW"' +
    //                 ',"role":"tenant"';
    //             }
    //         var randomVarAppName = Math.floor(Math.random()*3);
    //              if(randomVarAppName==0){
    //                 BaseData =  BaseData        +   ',"AppName":"Metal fastener"';
    //              }else if(randomVarAppName==1){
    //                 BaseData =  BaseData        +   ',"AppName":"Production Visualization"';
    //              }else{
    //                 BaseData =  BaseData        +   ',"AppName":"Forging"';
    //              }
    //         if(randomVar==0){
    //             let CountData            =   BaseData   +
    //                         ',"Type":"Count"'           +
    //                         ',"CountName":"APInumber"';

    //             var randomVar = Math.floor(Math.random()*20)+1;        
    //                 CountData = CountData     + ',"Count":"'+randomVar+'"}';
    //             publish(topic, CountData, options);
    //         }else if(randomVar==1){
    //             let RecordTimeData       =   BaseData   +
    //                         ',"Type":"RecordTime"'      +
    //                         ',"RecordType":"Start"'     +
    //                         ',"LongestTime":"600"}';
    //             publish(topic, RecordTimeData, options);
    //         }else if(randomVar==2){
    //             let RecordTimeData       =   BaseData   +
    //                         ',"Type":"RecordTime"'      +
    //                         ',"RecordType":"End"'       +
    //                         ',"LongestTime":"600"}';
    //             publish(topic, RecordTimeData, options);
    //         }else {
    //             let AccumulationTimeData =   BaseData   +
    //                         ',"Type":"AccumulationTime"';

    //             var randomVar = Math.floor(Math.random()*151)+300;       
    //                 AccumulationTimeData  =  AccumulationTimeData  + ',"Time":"'+randomVar+'"}';
    //             publish(topic, AccumulationTimeData, options);
    //         }
    //     }else if(flag==1){
    //         let BaseData =  '{"SSOToken":"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJXSVNFLVBhYVNAaWlpLWNmbGFiLmNvbSIsImlhdCI6MTU2NzQwODc3MywiZXhwIjoxNTY3NDEyMzczLCJ1c2VySWQiOiIwYmUyYjU1NC1kN2IyLTQ2NTYtYjEyNy1kMDhkYTlhZmZiZjkiLCJ1YWFJZCI6Ijk5MWIyZWUzLWU5ZjMtNDJlZi05YjJjLTJhMzM4NmM2OWYxZiIsImNyZWF0aW9uVGltZSI6MTU1NDcyOTQ2ODAwMCwibGFzdE1vZGlmaWVkVGltZSI6MTU1NDc3ODgzNTAwMCwidXNlcm5hbWUiOiJlaXBhYXNzc29yb290QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IlNpZ24gT24iLCJsYXN0TmFtZSI6IlNpbmdsZSIsInJvbGUiOiJhZG1pbiIsImdyb3VwcyI6WyJlaXBhYXNzc29yb290QGdtYWlsLmNvbSJdLCJjZlNjb3BlcyI6W3siZ3VpZCI6bnVsbCwic3NvX3JvbGUiOiJhZG1pbiIsInNwYWNlcyI6W119XSwic2NvcGVzIjpbXSwic3RhdHVzIjoiYWN0aXZlIiwib3JpZ2luIjoiU1NPIiwib3ZlclBhZGRpbmciOmZhbHNlLCJzeXN0ZW0iOmZhbHNlLCJyZWZyZXNoVG9rZW4iOiJiM2ViZDVmZS04ZmY0LTQ5NDktYWQxNy0wMjUwNDMxZDY5ZTgifQ.-v3igxHyb7jFglMHTV9U_Shg3CHmj2oUfq-iAM3sKilyKZj_qToN_IJ1yROirwk-HOp_tmRNiE6bURJzcJcHQQ"'              +
    //                             ',"country":"TW"';
    //         var randomVar2 = Math.floor(Math.random()*3);

    //         if(randomVar2==0){
    //             BaseData =  BaseData        +   ',"AppName":"Metal fastener"';
    //         }else if(randomVar2==1){
    //             BaseData =  BaseData        +   ',"AppName":"Production Visualization"';
    //         }else{
    //             BaseData =  BaseData        +   ',"AppName":"Forging"';
    //         }        

        
    //         if(randomVar==0){
    //             let CountData            =   BaseData   +
    //                         ',"Type":"Count"'           +
    //                         ',"CountName":"APInumber"' ;
    //             var randomVar = Math.floor(Math.random()*20)+1;        
    //             CountData = CountData     + ',"Count":"'+randomVar+'"}';
    //             publish(topic, CountData, options);
    //         }else if(randomVar==1){
    //             let RecordTimeData       =   BaseData   +
    //                         ',"Type":"RecordTime"'      +
    //                         ',"RecordType":"Start"'     +
    //                         ',"LongestTime":"600"}';
    //             publish(topic, RecordTimeData, options);
    //         }else if(randomVar==2){
    //             let RecordTimeData       =   BaseData   +
    //                         ',"Type":"RecordTime"'      +
    //                         ',"RecordType":"End"'       +
    //                         ',"LongestTime":"600"}';
    //             publish(topic, RecordTimeData, options);
    //         }else {
    //             let AccumulationTimeData =   BaseData   +
    //                         ',"Type":"AccumulationTime"';
    //             var randomVar = Math.floor(Math.random()*151)+300;       
    //             AccumulationTimeData  =  AccumulationTimeData  + ',"Time":"'+randomVar+'"}';
    //             publish(topic, AccumulationTimeData, options);
    //         }
    //     }
    //     // '{"d":{"WISE4010-7W28A9":{' + 
    //     //         '"W4010-28A9_Fz1Volt" : ' + (Math.random()*100).toFixed(2) + ',' +
    //     //         '"W4010-28A9_Fz1Temp" : ' + (Math.random()*100).toFixed(2) +
    //     //         '}}, "ts":"2019-04-13T00:19:19+08:00"}';
    // }, duration);
    // mqtt.subscribe(topic);
    // function publish(topic, msg, options){
    //     if (mqtt.connected && count<=100000){
    //         mqtt.publish(topic, msg, options, function(err){
    //             if (!err) {
    //                 console.log(count ++);
    //             } else {
    //                 console.error(count ++);
    //             }
    //         });
    //     }
    // };    
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