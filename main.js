let connectButton = document.getElementById('connect');
let disconnectButton = document.getElementById('disconnect');
let coolButton = document.getElementById('cool');
let heatButton = document.getElementById('heat');
let dryButton = document.getElementById('dry');
let offButton = document.getElementById('off');
let tempUpButton = document.getElementById('tempUp');
let tempDownButton = document.getElementById('tempDown');
let terminalContainer = document.getElementById('terminal');
var isConnectedView = document.getElementById('connectView');
var powerView = document.getElementById('powerView');
var tempView = document.getElementById('tempView');
var setTempView = document.getElementById('setTempView');
var modeView = document.getElementById('modeView');
var fanView = document.getElementById('fanView');

connectButton.addEventListener('click', function() {
	connect();
});

disconnectButton.addEventListener('click', function() {
	disconnect();
});

coolButton.addEventListener('click', function() {
	send('!COOL');
});

heatButton.addEventListener('click', function() {
	send('!HEAT');
});

offButton.addEventListener('click', function() {
	send('!OFF');
});

dryButton.addEventListener('click', function() {
	send('!DRY');
});

tempUpButton.addEventListener('click', function() {
	send('!TEMP+');
});

tempDownButton.addEventListener('click', function() {
	send('!TEMP-');
});

let deviceCache = null;

function connect() {
	return (deviceCache ? Promise.resolve(deviceCache) :
		requestBluetoothDevice()).
		then(device => connectDeviceAndCacheCharacteristic(device)).
		then(characteristic => startNotifications(characteristic)).
		catch(error => log(error));
}

function requestBluetoothDevice() {
	log('Requesting bluetooth device...');

	return navigator.bluetooth.requestDevice({
		filters: [{services: [0xFFE0]}],
	}).
		then(device => {
			log('"' + device.name + '" bluetooth device selected');
			deviceCache = device;

			deviceCache.addEventListener('gattserverdisconnected',
				handleDisconnection);

			return deviceCache;
		});
}

function handleDisconnection(event) {
	let device = event.target;

	log('"' + device.name +
		'" bluetooth device disconnected, trying to reconnect...');

	connectDeviceAndCacheCharacteristic(device).
		then(characteristic => startNotifications(characteristic)).
		catch(error => log(error));
}

let characteristicCache = null;

function connectDeviceAndCacheCharacteristic(device) {
	if (device.gatt.connected && characteristicCache) {
		return Promise.resolve(characteristicCache);
	}

	log('Connecting to GATT server...');

	return device.gatt.connect().
		then(server => {
			log('GATT server connected, getting service...');

			return server.getPrimaryService(0xFFE0);
		}).
		then(service => {
			log('Service found, getting characteristic...');

			return service.getCharacteristic(0xFFE1);
		}).
		then(characteristic => {
			log('Characteristic found');
			characteristicCache = characteristic;

			return characteristicCache;
		});
}
	
function startNotifications(characteristic) {
	log('Starting notifications...');

	return characteristic.startNotifications().
		then(() => {
			log('Notifications started');

			characteristic.addEventListener('characteristicvaluechanged',
				handleCharacteristicValueChanged);
		});
}

function log(data, type = '') {
	terminalContainer.insertAdjacentHTML('beforeend', '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}

function disconnect() {
	if (deviceCache) {
		log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
		deviceCache.removeEventListener('gattserverdisconnected',
			handleDisconnection);

		if (deviceCache.gatt.connected) {
			deviceCache.gatt.disconnect();
			log('"' + deviceCache.name + '" bluetooth device disconnected');
		}
		else {
			log('"' + deviceCache.name + 
			'" bluetooth device is already disconnected');
		}
	}

	if (characteristicCache) {
		characteristicCache.removeEventListener('characteristicvaluechanged',
			handleCharacteristicValueChanged);
	
		characteristicCache = null;
	}

	deviceCache = null; 
}

function send(data) {
	data = String(data);

	if (!data || !characteristicCache) {
		return;
	}

	data += '>';

	writeToCharacteristicCache(characteristicCache, data);
	log(data, 'out');
}

function writeToCharacteristicCache(characteristic, data) {
	characteristic.writeValue(new TextEncoder().encode(data));
}


//Intermediate buffer for incoming data

let readBuffer = '';

// Data receiving

function handleCharacteristicValueChanged(event) {
	let value = new TextDecoder().decode(event.target.value);

	for (let c of value) {
		if(c === '>') {
			let data = readBuffer.trim();
			readBuffer = '';

			if (data) {
				RTCRtpReceiver(data);
			}
		}
		else {
			readBuffer += c;
		}
	}
}

// Received data handling
function receive(data) {
	
	if (data.indexOf("<") === 0 && data.lastIndexOf(">") == 0) {
		var tempString = data.slice(1,data.length-2);
		log(tempString, 'in');
		var tempData = tempString.split("|");
		var i;
		var text = "";
		for (i = 0; i < tempData.length; i++) {
			text += tempData[i] + "<br>";
			log(text, 'in')
		}
	} else {
		log("Unknown format: ", 'in')
		log(data, 'in');
	}
}

