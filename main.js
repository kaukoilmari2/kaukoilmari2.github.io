//var Chart = require('chart.bundle.js');  //Statistics by Chart.js
var T = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var H = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var ctx = document.getElementById('statistics'); //Statistics by Chart.js
var statisticsBox = new Chart(ctx, {
	axisX: {
		reversed: true
	},
	type: 'line',
	fill: 'false',
	data: {
		labels: ['24', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13','12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
		datasets: [{
			label: 'Temp *C',
			fill: 'false',
		data: [/*parseFloat(T[24]), parseFloat(T[23]), parseFloat(T[22]), parseFloat(T[21]), parseFloat(T[20]), parseFloat(T[19]), parseFloat(T[18]), parseFloat(T[17]), parseFloat(T[16]), parseFloat(T[15]), parseFloat(T[14]), parseFloat(T[13]), parseFloat(T[12]), parseFloat(T[11]), parseFloat(T[10]), parseFloat(T[9]), parseFloat(T[8]), parseFloat(T[7]), parseFloat(T[6]), parseFloat(T[5]), parseFloat(T[4]), parseFloat(T[3]), parseFloat(T[2]), (T[1])*/],
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
		data: [/*parseInt(H[24]), parseInt(H[23]), parseInt(H[22]), parseInt(H[21]), parseInt(H[20]), parseInt(H[19]), parseInt(H[18]), parseInt(H[17]), parseInt(H[16]), parseInt(H[15]), parseInt(H[14]), parseInt(H[13]), parseInt(H[12]), parseInt(H[11]), parseInt(H[10]), parseInt(H[9]), parseInt(H[8]), parseInt(H[7]), parseInt(H[6]), parseInt(H[5]), parseInt(H[4]), parseInt(H[3]), parseInt(H[2]), (H[1])*/],
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
		maintainAspectRatio: false,
		title: {
            display: false,
            text: 'Last 24h data:'
        },
        scales: {
            yAxes: [{
				id: 'Temp',
				display: true,
				position: 'left',
                ticks: {
					beginAtZero: false,
					fontColor: 'rgba(255, 99, 132, 1)',				
					suggestedMin: 20,
					suggestedMax: 27
					
                }
			},{
				id: 'Hum',
				display: true,
				position: 'right',
                ticks: {
                    beginAtZero: false,
					fontColor: 'rgba(54, 162, 235, 1)',				
					suggestedMin: 40,
					suggestedMax: 60,
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
var isConnectedView = document.getElementById('animationContainer');
var powerView = document.getElementById('powerView');
var tempView = document.getElementById('tempView');
var setTempView = document.getElementById('setTempView');
var modeView = document.getElementById('modeView');
var humView = document.getElementById('humView');
var lastDataPacket = 0;
var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  


connectButton.addEventListener('click', function() {
	buttonResponse(50);
	connect();
	
});

disconnectButton.addEventListener('click', function() {
	buttonResponse(50);
	disconnect();
});

coolButton.addEventListener('click', function() {
	buttonResponse(100);
	send('!COOL');
});

heatButton.addEventListener('click', function() {
	buttonResponse(100);
	send('!HEAT');
});

offButton.addEventListener('click', function() {
	buttonResponse(100);
	send('!OFF');
});

dryButton.addEventListener('click', function() {
	buttonResponse(100);
	send('!DRY');
});

tempUpButton.addEventListener('click', function() {
	buttonResponse(100);
	send('!TEMP+');
});

tempDownButton.addEventListener('click', function() {
	buttonResponse(100);
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
	log('Etsitään bluetooth-laitteita...');

	return navigator.bluetooth.requestDevice({
		filters: [{services: [0xFFE0]}],
	}).
		then(device => {
			log('"' + device.name + '" valittu');
			deviceCache = device;

			deviceCache.addEventListener('gattserverdisconnected',
				handleDisconnection);

			return deviceCache;
		});
}

function handleDisconnection(event) {
	let device = event.target;

	log('"' + device.name +
		'" Yhteys katkesi - yhdistetään uudelleen...');

	connectDeviceAndCacheCharacteristic(device).
		then(characteristic => startNotifications(characteristic)).
		catch(error => log(error));
}

let characteristicCache = null;

function connectDeviceAndCacheCharacteristic(device) {
	if (device.gatt.connected && characteristicCache) {
		return Promise.resolve(characteristicCache);
	}

	log('Alustetaan palvelin...(GATT)');

	return device.gatt.connect().
		then(server => {
			log('Palvelin alustettu, haetaan palvelua...(Service)');

			return server.getPrimaryService(0xFFE0);
		}).
		then(service => {
			log('Palvelu löytyi, haetaan ominaisuuksia...(Characteristics)');

			return service.getCharacteristic(0xFFE1);
		}).
		then(characteristic => {
			log('Ominaisuudet löytyivät');
			characteristicCache = characteristic;

			return characteristicCache;
		});
}
	
function startNotifications(characteristic) {
	log('Avataan yhteyttä...(Notifications)');

	return characteristic.startNotifications().
		then(() => {
			log('Yhteys valmis!');
			buttonResponse()
			characteristic.addEventListener('characteristicvaluechanged',
				handleCharacteristicValueChanged);		
				setTimeout(function(){requestStats()}, 1000);
				
				
			});
	
}

function log(data, type = '') {
	terminalContainer.insertAdjacentHTML('beforeend', '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
	terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

function updateValues() {
	tempView.innerHTML = T[0] + "&#8451;";
	humView.innerText = H[0] + "%";
}

function disconnect() {
	if (deviceCache) {
		log('Katkaistaan yhteyttä "' + deviceCache.name + '"-bluetooth laitteeseen...');
		deviceCache.removeEventListener('gattserverdisconnected',
			handleDisconnection);

		if (deviceCache.gatt.connected) {
			deviceCache.gatt.disconnect();
			log('"' + deviceCache.name + '"-bluetooth laitteen yhteys katkaistu');
			lastDataPacket = 0;
			connectionIdler();
		}
		else {
			log('"' + deviceCache.name + 
			'" bluetooth-laitteen yhteys on jo katkaistu!');
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
	//log(data, 'out');
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
			//	log(data, 'in');
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
//	log(data, 'in');
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
					T[0] = parseFloat(dataArray[1]);
					break;
					
					case "T1":
					T[1] = parseFloat(dataArray[1]);
					break;
					
					case "T2":
					T[2] = parseFloat(dataArray[1]);
					break;
					
					case "T3":
					T[3] = parseFloat(dataArray[1]);
					break;
					
					case "T4":
						T[4] = parseFloat(dataArray[1]);
						break;
					
						case "T5":
				 		T[5] = parseFloat(dataArray[1]);
					 	break;
					
					 	case "T6":
						T[6] = parseFloat(dataArray[1]);
						break;
					
						case "T7":
						T[7] = parseFloat(dataArray[1]);
						break;
					
						case "T8":
				 		T[8] = parseFloat(dataArray[1]);
					 	break;
					
					 	case "T9":
						T[9] = parseFloat(dataArray[1]);
						break;

						case "T10":
						T[10] = parseFloat(dataArray[1]);
						break;
					
						case "T11":
						T[11] = parseFloat(dataArray[1]);
						break;
					
						case "T12":
						T[12] = parseFloat(dataArray[1]);
						break;
					
						case "T13":
						T[13] = parseFloat(dataArray[1]);
						break;
					
						case "T14":
						T[14] = parseFloat(dataArray[1]);
						break;
					
						case "T15":
				 		T[15] = parseFloat(dataArray[1]);
					 	break;
					
					 	case "T16":
						T[16] = parseFloat(dataArray[1]);
						break;
					
						case "T17":
						T[17] = parseFloat(dataArray[1]);
						break;
					
						case "T18":
				 		T[18] = parseFloat(dataArray[1]);
					 	break;
					
					 	case "T19":
						T[19] = parseFloat(dataArray[1]);
						break;

						case "T20":
						T[20] = parseFloat(dataArray[1]);
						break;
					
						case "T21":
						T[21] = parseFloat(dataArray[1]);
						break;
					
						case "T22":
						T[22] = parseFloat(dataArray[1]);
						break;
					
					case "T23":
					T[23] = parseFloat(dataArray[1]);
					break;
					
					case "T24":
						T[24] = parseFloat(dataArray[1]);
						break;
					
					case "H0":
					H[0] = parseInt(dataArray[1]);
					break;
					
					case "H1":
					H[1] = parseInt(dataArray[1]);
					break;
					
					case "H2":
					H[2] = parseInt(dataArray[1]);
					break;
					
					case "H3":
					H[3] = parseInt(dataArray[1]);
					break;
					
					case "H4":
					H[4] = parseInt(dataArray[1]);
					break;
					
					case "H5":
					H[5] = parseInt(dataArray[1]);
					break;
					
					case "H6":
					H[6] = parseInt(dataArray[1]);
					break;

					case "H7":
					H[7] = parseInt(dataArray[1]);
					break;
					
					case "H8":
					H[8] = parseInt(dataArray[1]);
					break;
					
					case "H9":
					H[9] = parseInt(dataArray[1]);
					break;
					
					case "H10":
					H[10] = parseInt(dataArray[1]);
					break;
					
					case "H11":
					H[11] = parseInt(dataArray[1]);
					break;
					
					case "H12":
					H[12] = parseInt(dataArray[1]);
					break;
					
					case "H13":
					H[13] = parseInt(dataArray[1]);
					break;
					
					case "H14":
					H[14] = parseInt(dataArray[1]);
					break;
					
					case "H15":
					H[15] = parseInt(dataArray[1]);
					break;
					
					case "H16":
					H[16] = parseInt(dataArray[1]);
					break;

					case "H17":
					H[17] = parseInt(dataArray[1]);
					break;
					
					case "H18":
					H[18] = parseInt(dataArray[1]);
					break;
					
					case "H19":
					H[19] = parseInt(dataArray[1]);
					break;

					case "H20":
							H[20] = parseInt(dataArray[1]);
							break;
							
							case "H21":
							H[21] = parseInt(dataArray[1]);
							break;
							
							case "H22":
							H[22] = parseInt(dataArray[1]);
							break;
							
							case "H23":
							H[23] = parseInt(dataArray[1]);
							break;
							
							case "H24":
							H[24] = parseInt(dataArray[1]);
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
					log("Tuntematon formaatti: ", 'in');
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
//	clearTimeout();
//	isConnected();
	updateValues();

	/*let statTemp = T;
	addData(statisticsBox, "Temp *C", statTemp);
	statTemp = H;
	addData(statisticsBox, "Hum %", statTemp);*/
	// KÄÄNNÄ STATSI TAKAPERIN!!
	const reversedT = [...T];
	reversedT.reverse();
	statisticsBox.data.datasets[0].data = reversedT;

	const reversedH = [...H];
	reversedH.reverse();
	statisticsBox.data.datasets[1].data = reversedH;
	
	//Kellonajat taulukkoon;
	var d = new Date();
	var tunnit = d.getHours();
	var minuutit = d.getMinutes();
	if (minuutit >= 30) {
		tunnit++;
		if (tunnit >= 24) {
			tunnit = 0;
		}
	}
	var timeLabels = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
			for(var i = 0; i < 25; i++) {
		var erotus = (tunnit - i);
		if (erotus < 0) {
			erotus += 24;
		}
		timeLabels[(24-i)] = erotus;
	}
	statisticsBox.config.data.labels = timeLabels;

	statisticsBox.update();
	isConnectedView.src = "mstile-150x150-blue.png";
	window.setTimeout(function() {connectionIdler()}, 5000)
	} else {
		log("Tuntematon formaatti: ", 'in');
		log(data, 'zek');
	}
}

function buttonResponse(vibrateTime) {
	if ("vibrate" in navigator) {
		navigator.vibrate(vibrateTime);
	} else {
		//Soita piippaus
		snd.play();
		
	}
}

function requestStats() {
	send("!STATS");
}

function connectionIdler() {
isConnectedView.src = "mstile-150x150.png"
}
