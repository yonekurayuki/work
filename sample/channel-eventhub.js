/**
 * Copyright 2016-2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


//テスト用
//var testutil = require('./util.js');
var test_user = require('./user.js');

//fabric依存ライブラリ
var User = require('fabric-client/lib/User.js');
var utils = require('fabric-client/lib/utils.js');
var Client = require('fabric-client');
var Peer = require('fabric-client/lib/Peer.js');
var ChannelEventHub = require('fabric-client/lib/ChannelEventHub.js');


//configをいじる時しか使ってない
//var sdkUtils = require('fabric-client/lib/utils.js');
/*
var rewire = require('rewire');
var RewiredChannelEventHub = rewire('fabric-client/lib/ChannelEventHub.js');
*/



//実行
ReceiveBlockEvent();
//ReceiveBlockEvent2();


//test('\n\n** ChannelEventHub block callback \n\n', (t) => {
function ReceiveBlockEvent(){
	let client = new Client();
	let peer = new Peer('grpc://127.0.0.1:7051');
	let channel = client.newChannel('mychannel');
	let eh = channel.newChannelEventHub(peer);

	var registrationOpts ={startBlock:1, endBlock:2, unregister:true, disconnect:true };

	var index = eh.registerBlockEvent((block) => {
		console.log("Successfully received blockEvent");
		console.log(block);
		//t.fail('Should not have called success callback when disconnect() is called');
		//t.end();
	}, (error) =>{
		console.log("Error: " +　error);
		//t.pass('Successfully called error callback from disconnect()');
		//t.end();
	}
//	,registrationOpts
	);

	eh.connect(true);

	//t.pass('successfully registered block callbacks');
	//t.equal(index, 1, 'Check the first block listener is at index 1');

	/*
	index = eh.registerBlockEvent(() => {
		// empty method body
	}, () => {
		// empty method body
	});
	*/

	//t.equal(index, 2, 'Check the 2nd block listener is at index 2');
	//t.equal(Object.keys(eh._blockRegistrations).length, 2, 'Check the size of the blockOnEvents hash table');

	//eh.disconnect();
};



/*
test('\n\n** ChannelEventHub block callback with replay \n\n', (t) => {
	let client = new Client();
	let peer = new Peer('grpc://127.0.0.1:7051');
	let channel = client.newChannel('mychannel');
	let eh = channel.newChannelEventHub(peer);

	var index = eh.registerBlockEvent((block) => {
		t.fail('Should not have called success callback');
		t.end();
	}, (error) =>{
		t.fail('Error callback should not be called');
		t.end();
	});

	t.pass('Successfully registered block callbacks');
	t.equal(index, 1, 'Check the first block listener is at index 1');
	try {
		index = eh.registerBlockEvent((block) => {
			t.fail('Should not have called success callback');
			t.end();
		}, (error) =>{
			t.fail('Should not have called error callback');
			t.end();
		},
			{startBlock: 1}
		);
		t.fail('Failed if the block event with a replay is registered after another block event');
	} catch(error) {
		if(error.toString().indexOf('Only one event registration is allowed')) {
			t.pass('Should not be able to register for more than one with replay');
		} else {
			t.fail('Should have gotten the only one event registration error ::'+error.toString());
		}
	}

	eh.unregisterBlockEvent(index);

	try {
		index = eh.registerBlockEvent((block) => {
			t.fail('Should not have called success callback');
			t.end();
		}, (error) =>{
			t.fail('Should not have called error callback');
			t.end();
		},
			{startBlock: 1}
		);
		t.pass('Successfully registered a playback block event');
	} catch(error) {
		t.fail( 'Failed - Should be able to register with replay');
	}

	t.equal(index, 2, 'Check the first block listener is at index 2');
	t.equal(Object.keys(eh._blockRegistrations).length, 1, 'Check the size of the blockOnEvents');

	t.end();
});
*/
/*
test('\n\n** ChannelEventHub transaction callback \n\n', (t) => {
	let client = new Client();
	let peer = new Peer('grpc://127.0.0.1:7051');
	let channel = client.newChannel('mychannel');
	let eh = channel.newChannelEventHub(peer);

	eh.registerTxEvent('txid1', (transid, status) => {
		// empty method body
	}, (error) =>{
		// empty method body
	});
	t.pass('successfully registered transaction callbacks');
	t.equal(Object.keys(eh._transactionRegistrations).length, 1, 'Check the size of the transactionOnEvents hash table');

	t.throws(
	 	() => {
			eh.registerTxEvent('txid1', (transid, status) => {
				t.fail('Should not have called success callback');
				t.end();
			}, (error) =>{
				t.fail('Should not have called error callback');
				t.end();
			});
	 	},
	 	/has already been registered/,
	 	'Checking for TransactionId (%s) has already been registered'
	 );

	eh.registerTxEvent('txid2', (transid, status) => {
		t.fail('Should not have called success callback');
		t.end();
	}, (error) =>{
		t.pass('Should have called error callback');
		t.end();
	});

	t.equal(Object.keys(eh._transactionRegistrations).length, 2, 'Check the size of the transactionOnEvents hash table');

	eh.disconnect(); //should call the t.end() in the txid1 error callback
});
*/
/*
test('\n\n** ChannelEventHub transaction callback with replay \n\n', (t) => {
	let client = new Client();
	let peer = new Peer('grpc://127.0.0.1:7051');
	let channel = client.newChannel('mychannel');
	let eh = channel.newChannelEventHub(peer);
	eh._force_reconnect = false;

	eh.registerTxEvent('transid', (transid, status) => {
		t.fail('Should not have called success callback');
		t.end();
	}, (error) =>{
		t.fail('Error callback should not be called');
		t.end();
	});

	t.pass('Successfully registered transaction callbacks');
	try {
		eh.registerTxEvent('transid', (transid, status) => {
			t.fail('Should not have called success callback');
			t.end();
		}, (error) =>{
			t.fail('Should not have called error callback');
			t.end();
		},
			{startBlock: 1, endBlock: 2}
		);
		t.fail('Failed if the transaction event with a replay is registered after another transaction event');
	} catch(error) {
		if(error.toString().indexOf('Only one event registration is allowed')) {
			t.pass('Should not be able to register for more than one with replay');
		} else {
			t.fail('Should have gotten the only one event registration error ::'+error.toString());
		}
	}

	eh.unregisterTxEvent('transid');

	try {
		eh.registerTxEvent('transid', (transid, status) => {
			t.fail('Should not have called success callback');
			t.end();
		}, (error) =>{
			t.fail('Should not have called error callback');
			t.end();
		},
			{startBlock: 1, endBlock: 2}
		);
		t.pass('Successfully registered a playback transaction event');
	} catch(error) {
		t.fail( 'Failed - Should be able to register with replay');
	}
	t.equal(Object.keys(eh._transactionRegistrations).length, 1, 'Check the size of the transactionOnEvents');

	eh._last_block_seen = Long.fromValue(2);
	eh._checkReplayEnd();
	t.equals(Object.keys(eh._transactionRegistrations).length, 0 ,'Check that the checkReplayEnd removes the startstop registered listener');


	t.throws(
	 	() => {
			eh = channel.newChannelEventHub(peer);
			eh.registerTxEvent('txid3', (transid, status) => {
				t.fail('Should not have called success callback');
				t.end();
			}, (error) =>{
				t.fail('Should not have called error callback');
				t.end();
			},
				{startBlock: 2, endBlock: 1}
			);
	 	},
	 	/must not be larger than/,
	 	'Checking for "startBlock" (%s) must not be larger than "endBlock" (%s)'
	 );

	t.end();
});
*/


/*
test('\n\n** ChannelEventHub test connect failure on transaction registration \n\n', (t) => {
	var client = new Client();
	var channel = client.newChannel('mychannel');
	let peer = new Peer('grpc://127.0.0.1:9999');
	var event_hub = null;
	var member = new User('user1');
	var crypto_suite = utils.newCryptoSuite();
	crypto_suite.setCryptoKeyStore(utils.newCryptoKeyStore());
	member.setCryptoSuite(crypto_suite);
	crypto_suite.generateKey()
	.then(function (key) {
		return member.setEnrollment(key, test_user.TEST_CERT_PEM, 'DEFAULT');
	}).then(() => {
		var id = member.getIdentity();
		client.setUserContext(member, true);

		// tx test
		event_hub = channel.newChannelEventHub(peer);
		event_hub.registerTxEvent('123',
			(tx_id, code) => {
				t.fail('Failed callback should not have been called - tx test 2');
				t.end();
			},
			(error) => {
				if(error.toString().indexOf('Connect Failed')) {
					t.pass('Successfully got the error call back tx test 2 ::'+error);
				} else {
					t.failed('Failed to get connection failed error tx test 2 ::'+error);
				}
				t.end();
			}
		);

		event_hub.connect();
		let sleep_time = 3000;
		t.comment('about to sleep '+sleep_time);

		return sleep(sleep_time);
	}).then((nothing) => {
		t.pass('Sleep complete');
		// eventhub is now actually not connected
	}).catch((err) => {
		t.fail(err.stack ? err.stack : err);
		t.end();
	});
});
*/

//test('\n\n** EventHub test reconnect on block registration \n\n', (t) => {
function ReceiveBlockEvent2(){
	var client = new Client();
	var channel = client.newChannel('mychannel');
	let peer = new Peer('grpc://127.0.0.1:7051');
	var event_hub = null;
	var member = new User('user1');
	var crypto_suite = utils.newCryptoSuite();
	crypto_suite.setCryptoKeyStore(utils.newCryptoKeyStore());
	member.setCryptoSuite(crypto_suite);
	crypto_suite.generateKey()
	.then(function (key) {
		return member.setEnrollment(key, test_user.TEST_CERT_PEM, 'DEFAULT');
	}).then(() => {
		var id = member.getIdentity();
		client.setUserContext(member, true);

		/*
		event_hub = channel.newChannelEventHub(peer);
		t.doesNotThrow(
			() => {
				event_hub.registerBlockEvent((tx_id, code) => {
					t.fail('Failed callback should not have been called - block test 1');
				});
			},
			null,
			'Check for The event hub has not been connected to the event source - block test 1'
		);
		*/

		event_hub = channel.newChannelEventHub(peer);
		event_hub.registerBlockEvent(
			(tx_id, code) => {
				console.log("Successfully ReceivedBlockEvent");
				console.log("TxID: " +　tx_id);
				console.log("code: " + code);
				//t.fail('Failed callback should not have been called - block test 2');
				//t.end();
			},
			(error) =>{
				console.log("Error: " + error);
				/*
				if(error.toString().indexOf('Connect Failed')) {
					t.pass('Successfully got the error call back block test 2 ::'+error);
				} else {
					t.failed('Failed to get connection failed error block test 2 ::'+error);
				}
				t.end();
				*/
			}
		);
		event_hub.connect(true); //fullBlock = true
/*
		//let state = event_hub.checkConnection();
		//t.equals(state, 'UNKNOWN_STATE', 'Check the state of the connection');

		// force the connections
		// runs asynchronously, must be an error callback registered to get the
		// failure will be reported to an error callback
		state = event_hub.checkConnection(true);
		//t.equals(state, 'UNKNOWN_STATE', 'Check the state of the connection');
		let sleep_time = 5000; //need to sleep longer than request timeout
		//t.comment('about to sleep '+sleep_time);
		return sleep(sleep_time);
	}).then((nothing) => {
		t.pass('Sleep complete');
		// t.end() should come from the callback
	}).catch((err) => {
		t.fail(err.stack ? err.stack : err);
		t.end();
	});
*/

};



function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
