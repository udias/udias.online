/**
 * # Utility: Specific
 *
 * Common tasks for the application
 */

// processing blocks of task
const INSTRUCTIONS = {
  remote: {
    data ({ manifest, value, peer }) {
      return new Promise((resolve, reject) => {
        peer.seed(value).then((torrent) => {
          manifest.data = torrent.infoHash
          return resolve(manifest)
        })
      })
   },
   params ({ manifest, value, field }) {
     return new Promise((resolve) => {
       if (!manifest.params) {
         manifest.params = {}
       }
       manifest.params[field.name] = value
       return resolve(manifest)
     })
   }
 }
}

/**
 * Apply instructions to define a manifest object
 */
export function createManifest ({ type, setup, values, peer }) {

  const manifest = {
    type
  }

  const instructions = setup.map((field) => {
    const [ environment, key ] = field.role.split('-')
    const instruction = INSTRUCTIONS[environment][key]
    return instruction({ manifest, value: values[field.name], field, peer })
  })

  return Promise.all(instructions).then(() => manifest)
}
