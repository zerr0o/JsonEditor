import EventEmitter from 'events';
import fs from 'fs';
const path = require('path');
export default class FileSystem extends EventEmitter {

    isDevelopment = process.env.NODE_ENV !== 'production';
    data = null;

    constructor() {
        super();
        console.log("%c FileSystem ready !" , 'background: #bada55; color: #222')
    }

    /**
     *  Write an object to a file on disk, can override an existing one
     * @param data the object to write
     * @param file the file name ( use ".json" )
     * @param cbSuccess success callback
     * @param cbError error callback
     */
    write(data , file ,cbSuccess,cbError , isJson = true )
    {
        let me = this;
        if(isJson)
            me.data = JSON.parse(data);
        let prodPath = "";
        if(!me.isDevelopment) prodPath = "\\resources\\";



        fs.access(process.cwd()+prodPath+"\\files\\", fs.constants.F_OK, (err) => {
            if(err)
            {
                fs.mkdir(process.cwd()+prodPath+"\\files\\", {recursive:true}, ()=>{
                    fs.writeFile(
                        process.cwd()+prodPath+"\\files\\"+file,
                        isJson ? JSON.stringify(me.data, null, 2) : data,
                        (err) => {
                            console.log('%c FILE SAVED ', 'background: #222; color: #bada55');

                            if( cbSuccess)
                                cbSuccess("done");
                            if( err && cbError )
                                cbError(err);
                        });
                });
            } else {
                fs.writeFile(
                    process.cwd()+prodPath+"\\files\\"+file,
                    isJson ? JSON.stringify(me.data, null, 2) : data,
                    (err) => {
                        console.log('%c FILE SAVED ', 'background: #222; color: #bada55');
                        if( cbSuccess)
                            cbSuccess("done");
                        if( err && cbError )
                            cbError(err);
                    });
            }
        });
    }

    writeFile()
    {

    }

    /**
     * Load a file from disk
     * @param file the file to load ( use ".json" )
     * @param cbSuccess success callback returning the object
     * @param cbError error callback
     */
    load(file,cbSuccess,cbError, isJson = true)
    {
        let me = this;
        fs.access(file, fs.constants.F_OK, (err) => {
            if(!err)
            {
                fs.readFile(file, 'utf8', function(err, data){
                    if(isJson)
                        data = JSON.parse(data);
                    if( cbSuccess)
                        cbSuccess(data);
                    if( err && cbError )
                        cbError(err);
                });
            }
            else
            {
                console.log(err);
                if( cbError )
                    cbError(err);
            }


        });

    }

    /**
     * List all file in a directory , returning a string array
     * @param dir the directory to list
     * @param cb success callback returning the string array
     */
    getAllFile(dir, cb)
    {
        FileSystem.listDirectoryRecursive( dir , (error , data)=>
        {
            if (cb) cb(error, data);
        })
    }

    /**
     * List all file in a directory , returning a string array (  ! use getAllFile to access it !)
     * @param dir the directory to list
     * @param cb success callback returning the string array
     */
    static listDirectoryRecursive(dir, cb)
    {
        let results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return cb(err);
            let pending = list.length;
            if (!pending) return cb(null, results);
            list.forEach(function(file) {
                file = path.resolve(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        console.log(stat);
                        FileSystem.listDirectoryRecursive(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) cb(null, results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) cb(null, results);
                    }
                });
            });
        });

    }




}
