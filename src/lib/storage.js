'use strict'

const { Storage } = require('@google-cloud/storage')

class GoogleCloudStorage {
  constructor () {
    this.storage = new Storage()
  }

  async downloadAsBase64 (uri) {
    const gcsKey = uri[2]
    if (!gcsKey) { return }
    const split = gcsKey.split('/')
    const bucket = split[0]
    const file = split[1]

    const encryptedFile = await this.storage
      .bucket(bucket)
      .file(file)
      .download()

    if (!encryptedFile) return

    return Buffer.from(encryptedFile[0]).toString('base64')
  }
}

module.exports = GoogleCloudStorage
