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
// Using Minimsit to accept CLI input: Minimsit is a library that helps to parse command line arguments and options. It is a very popular library and is used in many projects. It is very easy to use and has a lot of features. It is also very lightweight.

const args = require('minimist')(process.argv.slice(2))

// slice(2) is used to remove the first two arguments from the process.argv array. The first two arguments are the path to the node executable and the path to the file that is being executed. we import minimist and pass the process.argv.slice(2) to it. This will return an object with the arguments and options passed to the command line.

console.log(args)
*/

const minimist = require('minimist')
// eslint-disable-next-line no-unused-vars
// default is used to set default values for the arguments
// minimist's default option is used to set default values for the arguments. If the argument is not passed, then the default value will be used.
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
