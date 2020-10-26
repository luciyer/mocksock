const Chance = require("chance")
const chance = new Chance()

const deviceTypes = [
  "AppleiOS", "AndroidX", "Desktop-MacOS", "Desktop-Windows10"
]

module.exports = () => {
  return {
    eventId: chance.guid(),
    connected: new Date(),
    user: chance.email({ domain: "sisqo.com" }),
    device: chance.pickone(deviceTypes),
    ipAddress: chance.ip(),
    geo: chance.coordinates(),
    country: chance.country(),
    token: chance.apple_token()
  }
}
