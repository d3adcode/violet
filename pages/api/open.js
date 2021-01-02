import fs from 'fs'

// Using custom promise to override false positive
// about api resolving without returning a response
export default (req,res) => new Promise(
  async resolve => {
    fs.readFile(req.query.filename,'utf8',function(err,contents) {
      let status = 200
      if (err) {
        status = 500
        contents = `Could not read file [${req.query.filename}]: ${err}`
        console.error(contents)
      }
      res.status(status).send(contents)
    })
  }
);
