function startStream(playerElement, wsUri, token, useWorker, webgl, onConnected, onDisconnected) {
	if (!window.player) {
		window.player = new Player({ useWorker: useWorker, webgl: webgl, size: { width: 848, height: 480 } })
		document.getElementById(playerElement).appendChild(window.player.canvas)
    }
    
    var ws = new WebSocket(wsUri + "?token=" + token)
    ws.binaryType = 'arraybuffer'
    ws.onerror = function(error, data) {
        
    }

    ws.onopen = function (event) {
        onConnected();
        ws.onmessage = function (msg) {
            window.player.decode(new Uint8Array(msg.data))
            if(window.debugger) window.debugger.nal(msg.data.byteLength)
        }
        ws.onerror = null;
    }
    ws.onclose = function (event) {
        if (event.code == 1006) {
            onConnected("Could not connect to remote server (1006: ERR_CONNECTION_REFUSED)")
        }
    }

}

window.startStream = startStream;

// debugger stuff
function avgFPS(length) {
	this.index = 0
	this.sum = 0
	this.length = length
	this.buffer = Array.apply(null, Array(length)).map(Number.prototype.valueOf,0);
	this.tick = function(tick) {
		this.sum -= this.buffer[this.index]
		this.sum += tick
		this.buffer[this.index] = tick
		if (++this.index == this.length) this.index = 0
		return Math.floor(this.sum/this.length)
	}
	this.avg = function() {
		return Math.floor(this.sum/this.length)
	}
	return this
}

function debug(playerElement) {
	this.started = +new Date()
	this.fps = new avgFPS(50)
	this.last = +new Date()
	this.nals = 0
	this.frames = 0
	this.total = 0
	this.secondTotal = 0
	this.playerWidth = 0
	this.playerHeight = 0
	this.statsElement = document.createElement('div')
	document.getElementById(playerElement).appendChild(this.statsElement)
	window.player.onPictureDecoded = function(buffer, width, height, infos) {
		window.debugger.frame(width, height)
	}
	this.nal = function(bytes) {
		this.nals++
		this.total += bytes
		this.secondTotal += bytes
	}
	this.frame = function(w, h) {
		this.playerWidth = w
		this.playerHeight = h
		this.frames++
		var now = +new Date(), delta = now - window.debugger.last
		this.fps.tick(delta)
		this.last = now
	}
	setInterval(function() {
		var mib = (window.debugger.total/1048576).toFixed(2)
		var date = new Date(null)
		date.setSeconds((+new Date()-window.debugger.started)/1000)
		var dur = date.toISOString().substr(11, 8)
		window.debugger.statsElement.innerHTML = window.debugger.playerWidth+'x'+window.debugger.playerHeight+', '+Math.floor(1/window.debugger.fps.avg()*1000)+' fps, '+(window.debugger.secondTotal/1024).toFixed(2)+' KiB/s, total '+mib+' MiB, '+window.debugger.nals+' NAL units, '+window.debugger.frames+' frames in '+dur
		window.debugger.secondTotal = 0
	}, 1000)
}
