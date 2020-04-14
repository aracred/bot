module.exports = {
  environment(name) {
    return process.env[name] || null
  },
}
