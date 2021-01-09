//
let fs = require("fs");
var path = require('path');
let dirTree = require("directory-tree");
let fileType = require('file-type');
const fsPromises = require("fs").promises;
const { cpuUsage } = require("process");


var dirFiles = 0;
var dirToSendMovies = "E:\\Plex Media Server\\Téléchargés\\Films";
var dirToSendSeries = "E:\\Plex Media Server\\Téléchargés\\Séries";
var dirToSendAudio = "E:\\Plex Media Server\\Téléchargés\\Musiques";
var args = process.argv.slice(2);
var pathToSort = args[0];
var pathOfFileOrFolder = pathToSort.split("\\");
var nameOfFileOrFolder = pathOfFileOrFolder[pathOfFileOrFolder.length - 1];
var extToDel = ['.txt', '.nfo', '.url', '.lnk'];


var stats = fs.statSync(pathToSort);

if(stats.isFile()) {
    //It's a movie (or an episode of a serie) or an audio file
    console.log("DETECTED : Movie or 1 music");

    (async () => {
        var isAFileToCopy = true;
        var type = await fileType.fromFile(pathToSort);

        for(var i = 0 ; i < extToDel.length ; i++) {

            for(var j = 0 ; j < extToDel.length ; j++) {


                if(path.extname(pathToSort) === extToDel[j]) {
                
                    isAFileToCopy = false;
                    console.log("DETECTED : extToDel");

                }
            }

            if(isAFileToCopy) {

        if(path.extname(pathToSort) === extToDel[i]) {

            console.log("DETECTED : extToDel");

        } else {

                if(type.mime.toString().includes("audio")){
                    //It's an audio file
                    console.log("DETECTED : Music");
                    fs.copyFile(pathToSort, dirToSendAudio + "\\" + nameOfFileOrFolder, (err) => {
                    if (err) throw err;
                    console.log(nameOfFileOrFolder + " was copied to " + dirToSendAudio);
                    });
    
                } else if(type.mime.toString().includes("video")) {
                    //It's a movies
                    console.log("DETECTED : Movie")
                    fs.copyFile(pathToSort, dirToSendMovies + "\\" + nameOfFileOrFolder, (err) => {
                    if (err) throw err;
                    console.log(nameOfFileOrFolder + " was copied to " + dirToSendMovies);
                    });
    
                } else {
                    console.log("Meh.")

                }
        
            }
        }
    }

    })();
    
    

    

} else if(stats.isDirectory()) {

    var audios = 0;
    var videos = 0;


    //It's a serie season or an audio folder
    console.log("DETECTED : Serie season or audio folder")

    var tree = dirTree(pathToSort);
    dirFiles = tree.children.length;

    if(dirFiles === 0) {

        console.log("ERROR : Folder is empty");
        
    } else {

        var childrenTree = tree.children;

        for(let i = 0 ; i < dirFiles ; i++) {
            console.log(childrenTree[i].name);

            (async () => {
                var isAFileToCopy = true;
                var type = await fileType.fromFile(pathToSort + "\\" + childrenTree[i].name);
                
                for(var j = 0 ; j < extToDel.length ; j++) {


                    if(path.extname(pathToSort + "\\" + childrenTree[i].name) === extToDel[j]) {
                    
                        isAFileToCopy = false;
                        console.log("DETECTED : extToDel");

                    }
                }

                if(isAFileToCopy) {
                        if(type.mime.toString().includes("audio")){
                            //It's an audio file
                            console.log("DETECTED : Audio")

                            if(checkFileExists(dirToSendAudio + "\\" + nameOfFileOrFolder)){

                                fsPromises.mkdir(dirToSendAudio + "\\" + nameOfFileOrFolder).then(function() {

                                }).catch(function() {

                                });

                                fs.copyFile(pathToSort + "\\" + childrenTree[i].name, dirToSendAudio + "\\" + nameOfFileOrFolder + "\\" + childrenTree[i].name, (err) => {
                                    if (err) throw err;
                                    console.log(childrenTree[i].name + " was copied to " + dirToSendAudio + "\\" + nameOfFileOrFolder);
                                });
                            } else {
                                fs.copyFile(pathToSort + "\\" + childrenTree[i].name, dirToSendAudio + "\\" + nameOfFileOrFolder + "\\" + childrenTree[i].name, (err) => {
                                    if (err) throw err;
                                    console.log(childrenTree[i].name + " was copied to " + dirToSendAudio + "\\" + nameOfFileOrFolder);
                                });
                            }
                            
            
                        } else if(type.mime.toString().includes("video")) {
                            //It's a serie
                            console.log("DETECTED : Video");

                            if(checkFileExists(dirToSendSeries + "\\" + nameOfFileOrFolder)){

                                fsPromises.mkdir(dirToSendSeries + "\\" + nameOfFileOrFolder).then(function() {

                                }).catch(function() {

                                });

                                fs.copyFile(pathToSort + "\\" + childrenTree[i].name, dirToSendSeries + "\\" + nameOfFileOrFolder + "\\" + childrenTree[i].name, (err) => {
                                    if (err) throw err;
                                    console.log(childrenTree[i].name + " was copied to " + dirToSendSeries + "\\" + nameOfFileOrFolder);
                                });
                            } else {
                                fs.copyFile(pathToSort + "\\" + childrenTree[i].name, dirToSendSeries + "\\" + nameOfFileOrFolder + "\\" + childrenTree[i].name, (err) => {
                                    if (err) throw err;
                                    console.log(childrenTree[i].name + " was copied to " + dirToSendSeries + "\\" + nameOfFileOrFolder);
                                });
                            }
                            
            
                        } else {
                            console.log("Meh.");

                        }
                }
            })();
            
        }

    }

}

async function checkFileExists(file) {
  return fs.promises.access(file, fs.constants.F_OK)
           .then(() => true)
           .catch(() => false)
}

async function createDir(dir) {
    try {
      await fsPromises.access(dir, fs.constants.F_OK);
    } catch (e) {
      await fsPromises.mkdir(dir);
    }
  }