import cluster from 'node:cluster'
import os from 'node:os'
import * as process from 'node:process'
import { Injectable } from '@nestjs/common'
import { NODE_ENV } from './env.config'

const numCpUs =
  NODE_ENV === 'development' || NODE_ENV === 'test' ? 1 : os.cpus().length

@Injectable()
export class ClusterService {
  static clusterize(callback): void {
    if (cluster.isPrimary) {
      console.log(`MASTER SERVER (${process.pid}) IS RUNNING `)
      console.log(`Forking for ${numCpUs} CPUs`)

      for (let i = 0; i < numCpUs; i += 1) {
        cluster.fork()
      }

      cluster.on('exit', (worker, _code, _signal) => {
        console.log(`worker ${worker.process.pid} died`)
      })
    } else {
      callback()
    }
  }
}
