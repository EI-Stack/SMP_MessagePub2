"use strict";
const _ = require('underscore');
const config = {};
config.service = {};
config.mqtt = {};
config.influxdb = {};
config.mongodb = {};
config.restful = {};
let ensaas_services;

console.log("[ENSAAS_SERVICES]:" + process.env.ENSAAS_SERVICES);

if (!_.isUndefined(process.env.ENSAAS_SERVICES)) {
	ensaas_services = JSON.parse(process.env.ENSAAS_SERVICES);
	// Service
	config.version = process.env.VERSION;      		// Vesion
	config.port = process.env.PORT;				// Port
	config.topic = process.env.topic;
	config.ssourl = process.env.SSOURL;
	config.service.mqtt = process.env.SVC_MQTT;			// MQTT Service
	config.service.influxdb = process.env.SVC_INFLUXDB;		// Influxdb Service
	config.service.mongodb = process.env.SVC_MONGODB;		// MongoDB Service
	config.restful.verification = process.env.REST_VERIFY;        // Verify Tenant ID & Token
	config.restful.maxamount = process.env.REST_MAXAMOUNT;     // The maximum of amount.
	config.restful.defaultamount = process.env.REST_DEFAULTAMOUNT; // The default of amount.
	config.restful.order = process.env.REST_ORDER;
} else {
	config.version = "local";    // Vesion
	config.port = "8081";		// Port
	config.topic = "mirdc/metering/data";
	config.service.mqtt = true;		// MQTT Service
	config.service.influxdb = true;		// Influxdb Service
	config.service.mongodb = false;		// MongoDB Service
	config.restful.verification = false;      // Verify Tenant ID & Token
	config.restful.maxamount = 1000;     	// The maximum of amount.
	config.restful.defaultamount = 100; 		// The default of amount.
	config.restful.order = "DESC";
}
console.log("[config.service.mqtt]:" + config.service.mqtt);
console.log("[config.service.influxdb]:" + config.service.influxdb);
console.log("[config.service.mongodb]:" + config.service.mongodb);
console.log("[config.restful.verification]:" + config.restful.verification);
console.log("[config.restful.maxamount]:" + config.restful.maxamount);
console.log("[config.restful.defaultamount]:" + config.restful.defaultamount);
console.log("[config.restful.order]:" + config.restful.order);

// Server & MQTT & SCHEMA
if (config.service.mqtt.toString() === 'true') {
	if (!_.isUndefined(ensaas_services)) {
		if (!_.isUndefined(ensaas_services["p-rabbitmq"])) {
			let rmq_svc = ensaas_services["p-rabbitmq"][0];
			config.mqtt.broker = "mqtt://" + rmq_svc.credentials.externalHosts;
			config.mqtt.port = rmq_svc.credentials.protocols.mqtt.port;
			config.mqtt.username = rmq_svc.credentials.protocols.mqtt.username;
			config.mqtt.password = rmq_svc.credentials.protocols.mqtt.password;
			config.mqtt.qos = process.env.MQTT_QOS;
		} else {
			config.mqtt.broker = "mqtt://" + process.env.MQTT_HOST;
			config.mqtt.port = process.env.MQTT_PORT;
			config.mqtt.username = process.env.MQTT_USERNAME;
			config.mqtt.password = process.env.MQTT_PASSWORD;
			config.mqtt.qos = process.env.MQTT_QOS;
		}
	} else {
		// config.mqtt.broker	  	  = "http://192.168.50.187";	// MQTT Broker IP
		config.mqtt.broker = "http://192.168.50.187"; //"http://rabbitmq-001-pub.sa.wise-paas.com";	//"http://wise-msghub.eastasia.cloudapp.azure.com" for 187 MQTT Broker IP "http://124.9.14.79"  for cf-lab and mirdc 
		config.mqtt.port = 1883;			  							// MQTT Broker Port (Default:1883) 
		// config.mqtt.username	  = "user";
		// config.mqtt.password	  = "good4user";
		config.mqtt.username = "user";//"8cf044e2-5ed3-11ea-b206-d20b7873c901:7101a5e9-77ac-47bc-93dc-092e24ec4f30";
		config.mqtt.password = "good4user";//"PFKo8vEnXin5wsdttBHEHSHZD";//"dy1KnL1ti5N8Xxr1xPVY";
		//                       username for Mirdc MQTT 2e03cf86-ad47-4c29-bf52-160b5a073f2d:d9182d97-2d83-4d38-bd5f-075e95e8d52d
		//                       password for Mirdc MQTT sukfFUFEgTAXkfW5Ci50Rtocr
		//             III測試用, username for iii cf lab 3f3de3b6-493a-4e5a-a956-015c81aeaaa2:22116534-b4e5-4c97-86f6-34b74728759a
		//             III測試用, password for iii cf lab FdsTy87YDr95fYSWpLODD4CNY
		// config.mqtt.username	  = "cb0d845e-07d1-4736-909d-51b59e0bff1d:23bbc7b8-8941-4279-8cb6-61d7d97a65da";
		// config.mqtt.password	  = "RO0Mo52PdPLXIsCDioGhom74a";
		config.mqtt.retain = true;
		// config.schema.meta		  = "json-schema-draft-04.json";
		// config.schema.refs		  = "http://json-schema.org/draft-04/schema";
	}
	console.log("[config.mqtt.host]:" + config.mqtt.broker);
	console.log("[config.mqtt.port]:" + config.mqtt.port);
	console.log("[config.mqtt.username]:" + config.mqtt.username);
	console.log("[config.mqtt.password]:" + config.mqtt.password);
	console.log("[config.mqtt.qos]:" + config.mqtt.qos);
}

// Influxdb
if (config.service.influxdb.toString() === 'true') {
	if (!_.isUndefined(ensaas_services)) {
		if (!_.isUndefined(ensaas_services["influxdb"])) {
			let influxdb_svc = ensaas_services["influxdb"][0];
			config.influxdb.ip = influxdb_svc.credentials.externalHosts;
			config.influxdb.port = influxdb_svc.credentials.port;
			config.influxdb.username = influxdb_svc.credentials.username;
			config.influxdb.password = influxdb_svc.credentials.password;
			config.influxdb.db = influxdb_svc.credentials.database;
		} else {
			config.influxdb.ip = process.env.INFLUXDB_HOST;
			config.influxdb.port = process.env.INFLUXDB_PORT;
			config.influxdb.username = process.env.INFLUXDB_USERNAME;
			config.influxdb.password = process.env.INFLUXDB_PASSWORD;
			config.influxdb.db = process.env.INFLUXDB_DB;
		}
	} else {
		config.influxdb.ip = "192.168.50.187";//"13.76.230.96";	// 60.251.156.213
		config.influxdb.port = 8086;
		config.influxdb.username = "admin";//"bc52e306-d3f7-4571-994a-4a4dd8065fc4";
		config.influxdb.password = "1qaz@WSX";//"2SIgkRQYCNJH9DdEbx6pJ6w10";
		config.influxdb.db = "mirdc";
	}
	console.log("[config.influxdb.host]:" + config.influxdb.ip);
	console.log("[config.influxdb.port]:" + config.influxdb.port);
	console.log("[config.influxdb.username]:" + config.influxdb.username);
	console.log("[config.influxdb.password]:" + config.influxdb.password);
	console.log("[config.influxdb.db]:" + config.influxdb.db);
}

// MongoDB
if (config.service.mongodb.toString() === 'true') {
	if (!_.isUndefined(ensaas_services)) {
		if (!_.isUndefined(ensaas_services["mongodb"])) {
			let mongodb_svc = ensaas_services["mongodb"][0];
			config.mongodb.host = mongodb_svc.credentials.externalHosts;
			config.mongodb.username = mongodb_svc.credentials.username;
			config.mongodb.password = mongodb_svc.credentials.password;
			config.mongodb.db = mongodb_svc.credentials.database;
			config.mongodb.uplink_collection = process.env.UPLINK_COLLECTION;
			config.mongodb.rawuplink_collection = process.env.RAWUPLINK_COLLECTION;
			config.mongodb.downlink_collection = process.env.DOWNLINK_COLLECTION;
			config.mongodb.rawdownlink_collection = process.env.RAWDOWNLINK_COLLECTION;
		} else {
			config.mongodb.host = process.env.MONGODB_HOST;
			config.mongodb.username = process.env.MONGODB_UERNAME;
			config.mongodb.password = process.env.MONGODB_PASSWORD;
			config.mongodb.db = process.env.MONGODB_DB;
			config.mongodb.uplink_collection = process.env.UPLINK_COLLECTION;
			config.mongodb.rawuplink_collection = process.env.RAWUPLINK_COLLECTION;
			config.mongodb.downlink_collection = process.env.DOWNLINK_COLLECTION;
			config.mongodb.rawdownlink_collection = process.env.RAWDOWNLINK_COLLECTION;
		}
	} else {
		config.mongodb.host = "60.251.156.215";
		config.mongodb.username = "admin";
		config.mongodb.password = "good4admin";
		config.mongodb.db = "dataadapter";
		config.mongodb.uplink_collection = "schema_uplink";
		config.mongodb.rawuplink_collection = "raw_uplink";
		config.mongodb.downlink_collection = "schema_downlink";
		config.mongodb.rawdownlink_collection = "raw_downlink";
	}
	config.mongodb.uri = "mongodb://" + config.mongodb.username + ":" + config.mongodb.password +
		"@" + config.mongodb.host + "/" + config.mongodb.db;
	console.log("[config.mongodb.host]:" + config.mongodb.host);
	console.log("[config.mongodb.username]:" + config.mongodb.username);
	console.log("[config.mongodb.password]:" + config.mongodb.password);
	console.log("[config.mongodb.uri]:" + config.mongodb.uri);
	console.log("[config.mongodb.db]:" + config.mongodb.db);
	console.log("[config.mongodb.uplink_collection]:" + config.mongodb.uplink_collection);
	console.log("[config.mongodb.rawuplink_collection]:" + config.mongodb.rawuplink_collection);
	console.log("[config.mongodb.downlink_collection]:" + config.mongodb.downlink_collection);
	console.log("[config.mongodb.rawdownlink_collection]:" + config.mongodb.rawdownlink_collection);
}

module.exports = config;
