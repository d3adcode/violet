import fs from 'fs'

// Using custom promise to override false positive
// about api resolving without returning a response
export default (req,res) => new Promise(
  async resolve => {
    fs.writeFile(req.query.filename,req.query.text,function(err) {
      let status = 200
      let contents = `${req.query.filename} successfully written`
      if (err) {
        status = 500
        contents = `Could not write file [${req.query.filename}]: ${err}`
        console.error(contents)
      }
      res.status(status).send(contents)
    })
  }
);
