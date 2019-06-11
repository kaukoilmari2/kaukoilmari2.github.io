//var Chart = require('chart.bundle.js');  //Statistics by Chart.js
var ctx = document.getElementById('statistics'); //Statistics by Chart.js
var statisticsBox = new Chart(ctx, {
	type: 'line',
	fill: 'false',
	data: {
		labels: ['24', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13','12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
		datasets: [{
			label: 'Temp *C',
			fill: 'false',
			data: [20, 21, 22, 23, 24, 25, 20, 21, 22, 23, 24, 25, 20, 21, 22, 23, 24, 25, T6, T5, T4, T3, T2, parseFloat(T1)],
			backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            //    'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
             //   'rgba(54, 162, 235, 1)',
             ],
			borderWidth: 1,
			yAxisID: 'Temp'
		},
	{
		label: 'Hum %',
		fill: 'false',
		data: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 30, 35, 40, 45, 50, 55, 60, H6, H5, H4, H3, H2, H1],
		backgroundColor: [
		//	'rgba(255, 99, 132, 0.2)',
		    'rgba(54, 162, 235, 0.2)',
		],
		borderColor: [
		//	'rgba(255, 99, 132, 1)',
		    'rgba(54, 162, 235, 1)',
		 ],
		borderWidth: 1,
		yAxisID: 'Hum'
	}]
    },
    options: {
		title: {
            display: false,
            text: 'Last 24h data:'
        },
        scales: {
            yAxes: [{
				id: 'Temp',
				position: 'left',
                ticks: {
                    beginAtZero: false
                }
			},{
				id: 'Hum',
				position: 'right',
                ticks: {
                    beginAtZero: false
                }
				
			}]
        }
    }
});	//Statistics by Chart.js

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
var humView = document.getElementById('humView');
var lastDataPacket = 0;
var T0 = 0;
var T1 = 0;
var T2 = 0;
var T3 = 0;
var T4 = 0;
var T5 = 0;
var T6 = 0;
var H0 = 0;
var H1 = 0;
var H2 = 0;
var H3 = 0;
var H4 = 0;
var H5 = 0;
var H6 = 0;
/*
var now = new Date().getMilliseconds();

if (now - lastDataPacket < 10000) {
	isConnectedView.innerText = "YES";
}
if (now - lastDataPacket >= 10000) {
	isConnectedView.innerText = "?";
}
if (now - lastDataPacket >= 20000) {
	isConnectedView.innerText = "NO";
}
*/

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
	terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

function updateValues() {
	tempView.innerHTML = T0 + "&#8451;";
	humView.innerText = H0 + "%";
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
		if(c === '\n') {
			let data = readBuffer.trim();
			readBuffer = '';

			if (data) {
//				lastDataPacket = new Date().getMilliseconds();
				receive(data);
			}
		}
		else {
			readBuffer += c;
		}
	}
	
}

// Received data handling
function receive(data) {
	//log(data, 'in');
	if(data.indexOf('!') != -1 && data.indexOf('*') != -1)
	{
		var tempString = data.slice(data.indexOf('!')+1, data.lastIndexOf('*'));
	//	log(tempString, 'in')
		var tempData = tempString.split('|');
		var i;
		var text = "";
			for(i = 0; i < tempData.length; i++) {
				tempString = tempData[i];
				var dataArray = tempString.split(':');
				switch (dataArray[0])
				{	case "T0":
					T0 = parseFloat(dataArray[1]);
					break;
					
					case "T1":
					T1 = parseFloat(dataArray[1]);
					break;
					
					case "T2":
					T2 = parseFloat(dataArray[1]);
					break;
					
					case "T3":
					T3 = parseFloat(dataArray[1]);
					break;
					
					case "T4":
						T4 = parseFloat(dataArray[1]);
						break;
					
						case "T5":
				 	T5 = parseFloat(dataArray[1]);
					 break;
					
					 case "T6":
					T6 = parseFloat(dataArray[1]);
					break;
					
					case "H0":
					H0 = parseInt(dataArray[1]);
					break;
					
					case "H1":
					H1 = parseInt(dataArray[1]);
					break;
					
					case "H2":
					H2 = parseInt(dataArray[1]);
					break;
					
					case "H3":
					H3 = parseInt(dataArray[1]);
					break;
					
					case "H4":
					H4 = parseInt(dataArray[1]);
					break;
					
					case "H5":
					H5 = parseInt(dataArray[1]);
					break;
					
					case "H6":
					H6 = parseInt(dataArray[1]);
					break;

					case "M":
						var M = parseInt(dataArray[1]);
						if (M == 0) {
							modeView.innerText = "COOL";
						}
						if (M == 1) {
							modeView.innerText = "HEAT";
						}
						if (M == 2) {
							modeView.innerText = "DRY";
						}
						break;

						case "P":
								var P = parseInt(dataArray[1]);
							if (P == 1) {
								powerView.innerText = "ON";
							} else {
								powerView.innerText = "OFF";
							}
							break;

							case "Ts":
								var S = parseInt(dataArray[1]);
								setTempView.innerHTML = S + "&#8451;";
								break;
					
					default: 
					log("Unknown: ", 'in');
					log(dataArray[0], 'in');
					break;
			}
			}
	//		text += tempData[i] + "<br>";
	//		log(T0, 'in');
	//		log(H0, 'in');
	//		log(H1, 'in');
	//		log(H2, 'in');
	//		log(H3, 'in');
	//		log(H4, 'in');
	//		log(H5, 'in');
	//		log(H6, 'in');

	//		log("perse", 'in');
	updateValues();			
	} else {
		log("Unknown format: ", 'in');
		log(data, 'zek');
	}
}

