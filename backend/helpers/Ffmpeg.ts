import Ffmpeg from 'fluent-ffmpeg';
import { existsSync, mkdirSync } from 'fs';
import {v4 as uuidv4} from 'uuid';
import { join } from 'path';
import { binPaths, getBinPaths } from '../bin/binaries'

export const commonMimetypes = {
    '.mp4': 'video',
    '.mkv': 'video',
    '.mp3': 'audio',
    '.png': 'image',
    '.jpg': 'image',
}

const setPaths = (f = null) => {
    let {ffmpeg, ffprobe} = getBinPaths();
    f.setFfprobePath(ffprobe);
    f.setFfmpegPath(ffmpeg);
    return f
}

export const getMetadata = (filePath: string): Promise<[data: {[key:string]: any}, error: Error]> => new Promise((resolve, reject)=>{
    let f = setPaths(new Ffmpeg());
    f.input(filePath).ffprobe((err: Error, data)=> {
        if(err) reject([ null, err])
        resolve([data, null])
    })
})

export const mergeFiles = (paths: string[], output: string): Promise<[error: Error]> => new Promise( async (resolve, reject) => {
    let w = 1280, h = 720;
    let f = setPaths(new Ffmpeg());

    paths.forEach( file => f.input(file));
    let video = [];
    let audio = [];
    let concat = {
        inputs: [],
        filter: 'concat',
        options: {
            n: paths.length,
            v:1, a:1
        },
        outputs: ['v', 'a']
    }
    paths.forEach( (f, i) => {
        video.push({
            inputs: `${i}:v`, filter: 'scale',
            options: {w: `min(iw*${h}/ih\\,${w})`, h:`min(${h}\\,ih*${w}/iw)`},
            outputs: `video${i}`
        })
        audio.push({
            inputs: `${i}:a`, filter: 'anull', outputs: `audio${i}`
        })
        concat.inputs.push(`video${i}`);
        concat.inputs.push(`audio${i}`);
    })
    f.complexFilter([...video, ...audio, concat, '[v]fps=fps=25[v25]'], ['v25', 'a'])
    //.preset('veryfast')
    .output(output)
    //paths.forEach( path => f.input(path));
    .on('start', function(commandLine) {
        console.log("Comenzando con la combinación")
        console.log(commandLine);
      });
    f.on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        reject(err);
    })
    .on('end', function() {
        console.log('Merging finished !');
        resolve(null);
    })
    .on('progress', function(progress) {
     
        console.log('Processing: ' + JSON.stringify(progress, null, 2) );
      })
    .run()
    //.mergeToFile(output, tempFolder);
})

export const mergeCommand = (paths: string[], output: string) => {
    let w = 1280, h = 720;
    let filter_complex = [
        paths.map( (f, i) => `[${i}:v] scale=w=min(iw*${h}/ih\\,${w}):h=min(${h}\\,ih*${w}/iw), pad=w=${w}:h=${h}:x=(${w}-iw)/2:y=(${h}-ih)/2  [video${i}]`).join(';'),
        paths.map( (f, i) => `[${i}:a] anull [audio${i}]`).join(";"),
        paths.map( (f, i) => `[video${i}][audio${i}]`).join("")+ ` concat=n=${paths.length}:v=1:a=1 [v][a]`,
        '[v]fps=fps=25[v25]'
    ].join(";")
    let command: string[] = [
        getBinPaths().ffmpeg, '-y', '-loglevel warning',
        paths.map( file => `-i ${file}`).join(' '),
        `-filter_complex "${filter_complex}"`,
        ` -map "[v25]" -map "[a]" -c:a aac -c:v h264 -crf 18 -preset veryfast -f mp4 ${output}`
    ]
    return command;
}

export const extractClip = (path: string, options:{start: 0, end: 0}, output: string): Promise<Error> => new Promise((resolve, reject) => {
    let ffmpeg = setPaths(new Ffmpeg());

    ffmpeg
    .input(path)
    .seekInput(options.start)
    .duration(options.end-options.start)
    .outputOptions('-c copy')
    .output(output)
    .on('start', function(commandLine) {
        console.log("Comenzando con la combinación")
        console.log(commandLine);
    });
    ffmpeg.on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        reject(err);
    })
    .on('end', function() {
        resolve(null);
    })
    .on('progress', function(progress) {
        console.log('Processing: ' + progress.timemark );
        // console.log('Processing: ' + JSON.stringify(progress, null, 2) );
    })
    .run();
})