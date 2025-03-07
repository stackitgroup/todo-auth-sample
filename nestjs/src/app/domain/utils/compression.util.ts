import { promisify } from 'node:util'
import zlib from 'node:zlib'

const gunzipAsync = promisify(zlib.gunzip)

export class CompressionUtil {
  static compress(jsonString) {
    try {
      return zlib.gzipSync(Buffer.from(jsonString))
    } catch (error) {
      console.error('Error compressing:', error)
      throw error
    }
  }

  static async decompress(bufferComprimido) {
    try {
      const buffer = await gunzipAsync(bufferComprimido)

      return JSON.parse(buffer.toString())
    } catch (error) {
      console.error('Error decompressing:', error)
      throw error
    }
  }
}
