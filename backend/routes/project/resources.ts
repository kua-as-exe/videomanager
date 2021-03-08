import fileUpload from 'express-fileupload';
import {UploadedFile} from 'express-fileupload'
import * as express from 'express'
import * as uuid from 'uuid';
import { uniqueName, useApi, Resource } from '../helpers';
import { join, parse } from 'path';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync, renameSync, statSync } from 'fs';
import { commonMimetypes, getMetadata, mergeCommand, mergeFiles } from '../../helpers/Ffmpeg';
import { spawn, spawnSync } from 'child_process';
import { tools } from './resourcesUtils/tools';

var resources = express.Router();
resources.use(fileUpload({
    //useTempFiles : true,
    tempFileDir : '/tmp/',
    parseNested: true
}));


const refreshExclude = [
    'resources.json',
]

const refresh = async (req: express.Request): Promise<Resource[]> => {
    
    const { resourcesPath, resourcesJSONPath, resourcesData} = useApi(req);
    //console.log("a", resourcesData)
    let resources = resourcesData
    let tempResources = Object.assign([], resources);
    try{
    for await( let fileName of readdirSync(resourcesPath)){
        if(refreshExclude.includes(fileName) || fileName == null) continue; // exclude "resources.json"
        if(statSync(join(resourcesPath, fileName)).isDirectory()) continue;
        //console.log(fileName, tempResources)
        //console.log(tempResources.findIndex( res => res?.fileName == fileName))
        let index = tempResources.findIndex( res => res?.fileName == fileName)
        if(index >= 0){// if finds the archive
            delete tempResources[index] // remove known elements to optimize the array search
        }else{ // if dont find the resource on json
            console.log("Refreshing file: " + fileName)
            let filePath = join(resourcesPath, fileName);
            if(!existsSync(filePath)) continue;
            let [metadata, error ] = await getMetadata(filePath);
            if(error) continue; // if error, return. this is shit

            let id = uniqueName(parse(fileName).name)
            let ext = parse(fileName).ext;
            let newfileName = id+ext;
            let mimetype = (commonMimetypes[ext])? `${commonMimetypes[ext]}/${ext.replace('.', '')}`: 'unknown'

            let fileData: Resource = {
                id,
                fileName: newfileName, 
                uploaded: new Date(),
                name: parse(fileName).name,
                mimetype,
                size: metadata['format']['size'] | 0,
                metadata
            }
            //console.log(fileData);

            let oldFile = join(resourcesPath, fileName);
            let newFIle = join(resourcesPath, newfileName)
            copyFileSync(oldFile, newFIle);
            unlinkSync(oldFile)
            resources.push(fileData)
        }
    }
    }catch(e){console.error(e); throw Error(e)}
    resources = resources.filter( e => e !== null);
    return (resources)
}

resources.post('/user/:userID/project/:projectID/resources/refresh', async (req, res)=>{
    let { error, resourcesPath, resourcesJSONPath, resourcesData, writeResourcesData} = useApi(req);
    if(error) 
        { console.error(error); res.status(400).send(error); return };
    
    let newResourcesData = await refresh(req);
    newResourcesData = newResourcesData.filter( resource => existsSync(join(resourcesPath, resource?.fileName)));
    
    if(newResourcesData) writeResourcesData(newResourcesData)
    res.send({status: 'done'})
})

resources.get('/user/:userID/project/:projectID/outputs', (req, res)=>{
    //console.log(req.params)
    try{
        let { error, resourcesData, outputsPath } = useApi(req);
        if(error) throw error;

        let outputs = readdirSync(outputsPath);
        console.log(outputs)
        //console.log(resourcesData)
        res.send(outputs);
    }catch(e){
        console.error(e);
        res.status(400).send({error:e});
    }
})

resources.get('/user/:userID/project/:projectID/resources', (req, res)=>{
    //console.log(req.params)
    try{
        let { error, resourcesData } = useApi(req);
        if(error) throw error;
        if(!req.query['streams'])
            resourcesData = resourcesData.map( resource => {
                if(resource.metadata && resource.metadata['streams'])
                    delete resource.metadata['streams']
                return resource
            })

        //console.log(resourcesData)
        res.send(resourcesData);
    }catch( e){
        console.error(e);
        res.status(400).send({error:e});
    }
})

resources.post('/user/:userID/project/:projectID/resources/mergeVideos', async (req, res, next) => {
   try {
        const {error, resourcesPath, resourcesJSONPath, resourcesData, projectPath, outputsPath} = useApi(req);
        if(error) throw error;

        if(req.body.timeline === null) throw Error("No timeline provided")
        if(req.body.timeline.length == 0) throw Error("Timeline is void")
        
        let files: string[] = req.body.timeline
        console.log(files)
        files = files.map(filePath => join(resourcesPath, filePath))
        
        //console.log(mergeCommand(files, 'output.mp4'))
        //console.log(mergeCommand(files, 'output.mp4').join(" "))
        let date = new Date().toLocaleString().replace(/\//g, '-').replace(/ /g, '_').replace(/:/g, '_');


        let outputPath = join(outputsPath, `video-${date}.mp4`);
        await mergeFiles(files, outputPath)
        


        res.send({status: `wi`});
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
});
resources.post('/user/:userID/project/:projectID/resources/upload', async (req, res, next) => {
    try {
        const {error, resourcesPath, resourcesJSONPath, resourcesData} = useApi(req);
        if(error) throw error;
           
        if(req.files === null)
            {res.status(400).send({error: 'No files provided'}); return;}
        
        let files: UploadedFile[] = [];
        Object.values(req.files).forEach( file => {
            let myfiles = (<UploadedFile[]>file)
            if(myfiles.length === undefined)
                files.push(file||file[0])
            else 
                files = [...files, ...myfiles]
        });

        for await( let file of files){
            let id = uniqueName(parse(file.name).name)
            let fileName = id+parse(file.name).ext;
            let fileData: Resource = {
                fileName, id,
                uploaded: new Date(),
                name: parse(file.name).name,
                mimetype: file.mimetype,
                size: file.size
            }     
            let filePath = join(resourcesPath, fileName);
            await file.mv(filePath)
            let [metadata, err ] = await getMetadata(filePath);
            if(!err) fileData.metadata = metadata;
            resourcesData.push(fileData)
        }
        writeFileSync(resourcesJSONPath, JSON.stringify(resourcesData, null, 2))
        
        res.send({status: `uploaded ${files.length} files`});
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
});

resources.post('/user/:userID/project/:projectID/resources/delete', (req, res) => {
    try {
        let status = '';
        const {error, resourcesPath, resourcesJSONPath, resourcesData, trashPath} = useApi(req);
        if(error) throw error;
           
        let resourceID = String(req.body.resourceID);
        if(resourceID === "undefined")
            {res.status(400).send({error: 'No resource id provided'}); return;}

        let resourceData = resourcesData.find( r => r.id == resourceID);
        if(!resourceData)
            {res.status(400).send({error: 'Resource not exists'}); return;}

        let resourcePath = join(resourcesPath, resourceData.fileName);
        let resourceTrashPath = join(trashPath, resourceData.fileName);
        
        //console.log(resourcePath)
        //unlinkSync(resourcePath); // DO NOT DELETE, WILL BE DONE FOREVER
        renameSync(resourcePath, resourceTrashPath)        
        let newResourcesData = resourcesData.filter( resource => resource.id !== resourceID);
        writeFileSync(resourcesJSONPath, JSON.stringify(newResourcesData, null, 2));
        status = 'resource '+resourceID+' deleted';
       // console.log(status)
        res.send({status});        
    } catch (error) {
        status = 'Error while deleting: ' + error;
        console.error(status)
        res.status(400).send({error: status});
    }
})

resources.use(tools)
export {resources}