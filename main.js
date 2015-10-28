'use strict'

let serialport = require('serialport')
let SerialPort = serialport.SerialPort
let request = require('request')
let fs = require('fs')
let exec = require('child_process').exec

console.log('Hello arduino')

let key = fs.readFileSync('key.txt').toString();

serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName)
  })
})

let portName = process.argv[2]

var myPort = new SerialPort(portName, {
   baudRate: 9600,
   parser: serialport.parsers.readline('\n') //packet delimiter
})

myPort.on('open', showPortOpen)	
myPort.on('data', sendSerialData)
myPort.on('error', showError)


let loc = {
	lat: 0.0, 
	lng: 0.0
}

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function sendSerialData(data) {
	if (data.search('Lat') != -1) {
		let lat = data.replace('Lat', '')
		loc.lat = parseFloat(lat)
		console.log(lat)
	} else if (data.search('Lng') != -1){
		let lng = data.replace('Lng', '')
		loc.lng = parseFloat(lng)
		console.log(lng)
	}

	console.log('loc {\n\tlat: ' + loc.lat + ',\n\tloc: ' + loc.lng + '\n}')

	if (loc.lat != 0.0 && loc.lng != 0.0)
		dlImage(loc.lat, loc.lng)

}
  
function showError(error) {
   console.log('Serial port error: ' + error)
}


function dlImage(lat, lng) {

	let urlString = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + loc.lat + ',' + loc.lng + '&heading=151.78&pitch=-0.76&key=' + key; 

	let stream = fs.createWriteStream('result.png')

	request(urlString).pipe(stream).on('finish' , function() {
		stream.end()
		exec('open result.png', function(err, stdout, stderr) {})
	})
}

 