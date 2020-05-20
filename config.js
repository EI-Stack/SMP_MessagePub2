"use strict";
const _               	  = require('underscore');
const config 		  	  = {};
config.service 			  = {};
config.mqtt 			  = {};
config.schema			  = {};
config.influxdb   		  = {};
config.postgres  		  = {};
config.mongodb   		  = {};
config.restful			  = {};
let vcap_services;

// Service
console.log("[config] vcap_services:" + process.env.VCAP_SERVICES);
if(!_.isUndefined(process.env.VCAP_SERVICES)){
	config.version  		  		= process.env.app_version;      	// Vesion
	config.port						= process.env.port;					// Port
	config.service.mqtt		  		= process.env.service_mqtt;			// MQTT Service
	config.service.influxdb	  		= process.env.service_influxdb;		// Influxdb Service
	config.service.mongodb	  		= process.env.service_mongodb;		// MongoDB Service
	config.service.postgres	  		= process.env.service_postgres;		// Postgres Service
	config.service.redis	  		= process.env.service_redis;		// Redis Service
	vcap_services 	  		  		= JSON.parse(process.env.VCAP_SERVICES);	
	// RESTFUL APIs
	config.restful.verification		= process.env.restful_verification;	// Verify Tenant ID & Token
	config.restful.maxamount        = process.env.restful_maxamount;	// The maximum of amount.
	config.restful.defaultamount    = process.env.restful_defaultamount;// The default of amount.	
	config.restful.order    		= process.env.restful_order;		// The default of amount.	
} else {	
	config.version  		  		= "1.0.0"; 	 // Vesion
	config.topic  		  			= "mirdc/metering/data"; 	 // Topic  //data
	config.port						= 8088;		 // PORT
	config.service.mqtt		  		= true;		 // MQTT Service
	config.service.influxdb	  		= true;		 // Influxdb Service
	config.service.mongodb	  		= false; 	 // MongoDB Service	
	config.service.postgres	  		= false;	 // Postgres Service
	config.service.redis	  		= false;	 // Redis Service
	// RESTFUL APIs
	config.restful.verification		= false;	 // Verify Tenant ID & Token
	config.restful.maxamount        = 1000; 	  	 // The maximum of amount.
	config.restful.defaultamount    = 100;        // The default of amount.	
	config.restful.order 		    = "DESC";	 // The default of order.	
}
console.log("[config.restful.verification]:" + config.restful.verification);

// Server & MQTT & SCHEMA
if (config.service.mqtt.toString() === 'true') {
	if(!_.isUndefined(vcap_services)){
		config.mqtt.broker		  = "mqtt://" + vcap_services['p-rabbitmq'][0].credentials.protocols.mqtt.host;
		config.mqtt.port          = vcap_services['p-rabbitmq'][0].credentials.protocols.mqtt.port;
		config.mqtt.username	  = vcap_services['p-rabbitmq'][0].credentials.protocols.mqtt.username.trim();
		config.mqtt.password	  = vcap_services['p-rabbitmq'][0].credentials.protocols.mqtt.password.trim();
		config.mqtt.checktopic	  = process.env.mqtt_checktopic;  	// Check MQTT TOPIC
		config.mqtt.pgtopic		  = process.env.mqtt_pgtopic;	  	// PostgreSQL TOPIC
		config.mqtt.checkpgtopic  = process.env.mqtt_checkpgtopic; 	// Check PostgreSQL TOPIC
		config.mqtt.retain 		  = process.env.mqtt_retain; 	  	// MQTT Publish Retain
		config.schema.meta		  = process.env.schema_meta;
		config.schema.refs		  = process.env.schema_refs;
	} else {
		// config.mqtt.broker	  	  = "http://192.168.50.187";	// MQTT Broker IP
		config.mqtt.broker	  	  = "mqtt://rabbitmq-001-pub.sa.wise-paas.com";	//"http://wise-msghub.eastasia.cloudapp.azure.com" for 187 MQTT Broker IP "http://124.9.14.79"  for cf-lab and mirdc 
		config.mqtt.port		  = 1883;			  							// MQTT Broker Port (Default:1883) 
		// config.mqtt.username	  = "user";
		// config.mqtt.password	  = "good4user";
		config.mqtt.username	  = "8cf044e2-5ed3-11ea-b206-d20b7873c901:8adb1174-5ee1-11ea-b1de-d20dfb084846";
		config.mqtt.password	  = "PFKo8vEnXin5wsdttBHEHSHZD";
		//                       username for Mirdc MQTT 2e03cf86-ad47-4c29-bf52-160b5a073f2d:d9182d97-2d83-4d38-bd5f-075e95e8d52d
		//                       password for Mirdc MQTT sukfFUFEgTAXkfW5Ci50Rtocr
		//             III測試用, username for iii cf lab 3f3de3b6-493a-4e5a-a956-015c81aeaaa2:22116534-b4e5-4c97-86f6-34b74728759a
		//             III測試用, password for iii cf lab FdsTy87YDr95fYSWpLODD4CNY
		// config.mqtt.username	  = "cb0d845e-07d1-4736-909d-51b59e0bff1d:23bbc7b8-8941-4279-8cb6-61d7d97a65da";
		// config.mqtt.password	  = "RO0Mo52PdPLXIsCDioGhom74a";
		config.mqtt.retain 		  = true;
		config.schema.meta		  = "json-schema-draft-04.json";
		config.schema.refs		  = "http://json-schema.org/draft-04/schema";
	}
	console.log("[config.mqtt.host]:" 			+ config.mqtt.broker);
	console.log("[config.mqtt.port]:" 			+ config.mqtt.port);
	console.log("[config.mqtt.username]:" 		+ config.mqtt.username);
	console.log("[config.mqtt.password]:" 		+ config.mqtt.password);
	console.log("[config.schema.metas]:"		+ config.schema.meta);
	console.log("[config.schema.refs]:" 		+ config.schema.refs);
	console.log("[config.mqtt.retain]:" 		+ config.mqtt.retain);
}

// Influxdb
if (config.service.influxdb.toString() === 'true') {
	config.influxdb.serviceName	= process.env.influxdb_service_name;
	if (!_.isUndefined(config.influxdb.serviceName)) {
		let pcf_influxDB = _.findWhere(vcap_services[config.influxdb.serviceName],{"name":"influxdb"});
		if(!_.isUndefined(pcf_influxDB)){
			config.influxdb.ip        = pcf_influxDB.credentials.host;
			config.influxdb.port      = pcf_influxDB.credentials.port;
			config.influxdb.username  = pcf_influxDB.credentials.username;
			config.influxdb.password  = pcf_influxDB.credentials.password;
			config.influxdb.db  	  = pcf_influxDB.credentials.database;	
		} else {
			config.influxdb.ip        = process.env.influxdb_ip;
			config.influxdb.port      = process.env.influxdb_port;
			config.influxdb.username  = process.env.influxdb_username;
			config.influxdb.password  = process.env.influxdb_password;
			config.influxdb.db        = process.env.influxdb_db;
		}
	} else {
		config.influxdb.ip        = "13.76.230.96";	// 60.251.156.213
		config.influxdb.port      = 8086;
		config.influxdb.username  = "bc52e306-d3f7-4571-994a-4a4dd8065fc4";
		config.influxdb.password  = "2SIgkRQYCNJH9DdEbx6pJ6w10";
		config.influxdb.db        = "mirdc";
	}
	console.log("[config.influxdb.ip]:"		 	+ config.influxdb.ip);
	console.log("[config.influxdb.port]:"       + config.influxdb.port);
	console.log("[config.influxdb.db]:" 	  	+ config.influxdb.db);
	console.log("[config.influxdb.username]:" 	+ config.influxdb.username);
	console.log("[config.influxdb.password]:" 	+ config.influxdb.password);
}

// MongoDB
if (config.service.mongodb.toString() === 'true') { 
	config.mongodb.serviceName = process.env.mongodb_service_name;
	if(!_.isUndefined(config.mongodb.serviceName)){ 
		let pcf_mongoDB = _.findWhere(vcap_services[config.mongodb.serviceName],{"name":"mongodb"});
		if(!_.isUndefined(pcf_mongoDB)){
			config.mongodb.host		  	= pcf_mongoDB.credentials.host;
			config.mongodb.username	  	= pcf_mongoDB.credentials.username;
			config.mongodb.password	  	= pcf_mongoDB.credentials.password;
			config.mongodb.db    	  	= pcf_mongoDB.credentials.database;			
			config.mongodb.collection 	= process.env.mongodb_collection;
			config.mongodb.uri			= pcf_mongoDB.credentials.uri;
		} else {
			config.mongodb.host      	= process.env.mongodb_host;
			config.mongodb.username     = process.env.mongodb_username;
			config.mongodb.password     = process.env.mongodb_password;
			config.mongodb.db    	  	= process.env.mongodb_db;
			config.mongodb.collection 	= process.env.mongodb_collection;
			config.mongodb.uri		    = "mongodb://" + config.mongodb.username + ":" + config.mongodb.password + 
										  "@" + config.mongodb.host + "/" + config.mongodb.db;
		}
	} else {
		config.mongodb.host      	= "60.251.156.213:5566";
		config.mongodb.username     = "wise";
		config.mongodb.password     = "good4wise";
		config.mongodb.db    	  	= "wise";
		config.mongodb.collection 	= "schema";
		config.mongodb.uri		    = "mongodb://" + config.mongodb.username + ":" + config.mongodb.password + 
										"@" + config.mongodb.host + "/" + config.mongodb.db;
	}
	console.log("[config.mongodb.host]:"		+ config.mongodb.host);
	console.log("[config.mongodb.username]:" 	+ config.mongodb.username);
	console.log("[config.mongodb.password]:" 	+ config.mongodb.password);
	console.log("[config.mongodb.uri]:" 	 	+ config.mongodb.uri);
	console.log("[config.mongodb.db]:" 			+ config.mongodb.db);
	console.log("[config.mongodb.collection]:" 	+ config.mongodb.collection);
}

// PostgreSQL
if (config.service.postgres.toString() === 'true') { 
	config.postgres.serviceName	= process.env.postgres_service_name;
	if (!_.isUndefined(config.postgres.serviceName)) {
		let pcf_postgres = _.findWhere(vcap_services[config.postgres.serviceName],{"name":"postgresql"});
		if(!_.isUndefined(pcf_postgres)){
			config.postgres.ip        = pcf_postgres.credentials.host;
			config.postgres.port      = pcf_postgres.credentials.port;
			config.postgres.username  = pcf_postgres.credentials.username;
			config.postgres.password  = pcf_postgres.credentials.password;
			config.postgres.db  	  = pcf_postgres.credentials.database;	
		}
	} else {
		config.postgres.ip     	  = "60.251.156.213";	// postgres
		config.postgres.port	  = 54321;
		config.postgres.username  = "postgres";
		config.postgres.password  = "1qaz@WSX";
		config.postgres.db  	  = "dataworker";
	}
	console.log("[config.postgres.ip]:"		 	+ config.postgres.ip);
	console.log("[config.postgres.port]:"       + config.postgres.port);
	console.log("[config.postgres.db]:" 	  	+ config.postgres.db);
	console.log("[config.postgres.username]:" 	+ config.postgres.username);
	console.log("[config.postgres.password]:" 	+ config.postgres.password);
}

// Redis
if (config.service.redis.toString() === 'true') {
	config.redis.serviceName	= process.env.redis_service_name;
	if (!_.isUndefined(config.redis.serviceName)) {
		var pcf_redis = _.findWhere(vcap_services[config.redis.serviceName],{"name":"redis"});
		if(!_.isUndefined(pcf_redis)){
			config.redis.host   = pcf_redis.credentials.host;
			config.redis.port   = pcf_redis.credentials.port;			
		} else {
			config.redis.host	= process.env.redis_host;
			config.redis.port	= process.env.redis_port;
		}
	} else {
		config.redis.host	  	= "60.251.156.212";
		config.redis.port	  	= 6379;
	}
	console.log("[config.redis.host]:" + config.redis.host);
	console.log("[config.redis.port]:" + config.redis.port);
}

module.exports = config;
