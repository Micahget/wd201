/*
// importing fs module
const fs = require('fs')

// creating file using fs module using writeFile() function.
fs.writeFile(
  'sample.txt',
  'Hello World. Welcome to Node.js File System module.',
  (err) => {
    if (err) throw err
    console.log('File created!')
  }
)

// this is fs module method to readFile async
fs.readFile('sample.txt', (err, data) => {
  if (err) throw err
  console.log(data.toString())
})

// this is fs module method to update file using appeednFile method
fs.appendFile('sample.txt', ' This is my updated content', (err) => {
  if (err) throw err
  console.log('File updated!')
})

// this is to rename file name
fs.rename('sample.txt', 'test.txt', (err) => {
  if (err) throw err
  console.log('File name updated!')
})

// thisis to delete the file we created
fs.unlink('test.txt', (err) => {
  if (err) throw err
  console.log('File test.txt deleted successfully!')
})
// close file.
*/

/*
// accepting input from cli using readline module
const readline = require('readline')

const lineDetail = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

lineDetail.question('Please provide your name - ', (name) => {
  console.log(`Hi ${name}!`)
  lineDetail.close()
})
*/

/*

const args = require('minimist')(process.argv.slice(2))

console.log(args)
*/

const minimist = require('minimist')
/*
const args = minimist(process.argv.slice(2), {
  default: {
    greeting: 'Hello',
    goodbye: 'Goodbye'
  }
})
console.log(args)
*/

// minimist alias option is used to set aliases for the arguments. If the argument is not passed, then the default value will be used.
const args = minimist(process.argv.slice(2), {
  alias: {
    n: 'name',
    a: 'age'
  }
})
console.log(args)
