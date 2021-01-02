import fs from 'fs'

// Using custom promise to override false positive
// about api resolving without returning a response
export default (req,res) => new Promise(
  async resolve => {
    fs.readdir(req.query.path,function(err, items) {
      let status = 200
      let contents = items
      if (err) {
        status = 500
        contents = `Could not read directory [${req.query.path}]: ${err}`
        console.error(contents)
      }
      res.status(status).send(contents)
    })
  }
);
