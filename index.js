const {createAudio} = require('node-mp3-player')
const Audio = createAudio()
var five = require('johnny-five'),
  pin, bumper, led;

(async () => {

  let sentinceCount = 0
  let interruptCount = 0
  const line1 = await Audio('./sounds/text1.mp3')
  const line2 = await Audio('./sounds/text2.mp3')
  const line3 = await Audio('./sounds/text3.mp3')
  let lines = [line1, line2, line3]
  let sentinceTimeout
  let interruptRunning = false

  const i_line1 = await Audio('./sounds/interrupt1.mp3')
  const i_line2 = await Audio('./sounds/interrupt2.mp3')
  const i_line3 = await Audio('./sounds/interrupt3.mp3')
  let interruptLines = [i_line1, i_line2, i_line3]

  five.Board().on('ready', function () {

    led = new five.Led(13)
    var toggle = new five.Switch(8)

    toggle.on('close', function () {
      console.log('release')
      led.off()
    })

    // "open" the switch is opened
    toggle.on('open', function () {
      console.log('Press!!!!!!!!!!!!')
      led.on()
      interrupt()
    })

    function interrupt () {
      if (interruptRunning) {
        return false
      }
      interruptRunning = true
      clearInterval(sentinceTimeout)
      lines[sentinceCount].volume(0)
      interruptLines[sentinceCount].play()
      setTimeout(() => {
        interruptRunning = false
        play(true)
      }, 5000)
    }

    function play (next = false) {
      if (next) {
        sentinceCount = sentinceCount + 1
        if (sentinceCount > lines.length - 1) {
          sentinceCount = 0
        }
      }
      console.log('play', sentinceCount)
      lines[sentinceCount].volume(1)
      lines[sentinceCount].play()
      sentinceTimeout = setTimeout(() => {
        play(true)
      }, 20000)

    }

    play()

  })
})()