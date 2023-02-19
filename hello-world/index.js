//importing fs module
const fs = require("fs");

//creating file using fs module using writeFile() function.
fs.writeFile(
  "sample.txt",
  "Hello World. Welcome to Node.js File System module.",
  (err) => {
    if (err) throw err;
    console.log("File created!");
  }
);

//this is fs module method to readFile async
fs.readFile("sample.txt", (err, data) => {
  if (err) throw err;
  console.log(data.toString());
});

//this is fs module method to update file using appeednFile method
fs.appendFile("sample.txt", " This is my updated content", (err) => {
  if (err) throw err;
  console.log("File updated!");
});

//this is to rename file name
fs.rename("sample.txt", "test.txt", (err) => {
  if (err) throw err;
  console.log("File name updated!");
});

//thisis to delete the file we created
fs.unlink("test.txt", (err) => {
  if (err) throw err;
  console.log("File test.txt deleted successfully!");
});
//close file.
fs.close;