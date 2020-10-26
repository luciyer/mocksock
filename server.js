const { nanoid } = require("nanoid")
const Chance = require("chance")
const templates = require("./templates")

const chance = new Chance()
const io = require("socket.io")(process.env.PORT || 8080)

const inMinutes = (m) => {
  return new Date().setTime(new Date().getTime() + m * 60 * 1000)
}

const getInterval = (frequency) => {
  const { mean, dev } = frequency
  return frequency.type === "static"
    ? frequency.intervalSeconds * 1000
    : chance.normal({ mean: mean * 1000, dev: dev * 1000 });
}

const streamData = (roomId, frequency, template) => {
  if (new Date() <= frequency.expireDate) {
    setTimeout(() => {
      io.to(roomId).emit(template, templates[template]())
      streamData(roomId, frequency, template)
    }, getInterval(frequency))
  } else {
    console.log(`Lease expired. Stream ended.`)
  }
}

io.on("connection", socket => {

  console.log(`Client connected.`)

  socket.emit("templateList", { templates: Object.keys(templates) })

  socket.on("template", (options) => {

    const roomId = nanoid(8)
    const { frequency, template } = options
    frequency.expireDate = new Date(inMinutes(frequency.leaseMinutes))

    console.log(`Opening Stream:`, { roomId, frequency, template })

    socket.join(roomId)
    streamData(roomId, frequency, template)

  })

})
