import * as express from 'express'
import { writeFileSync } from 'fs';
import { join, parse } from 'path';
import { commonMimetypes, extractClip, getMetadata } from '../../../helpers/Ffmpeg';
import { PROCESS_MODES, Resource, uniqueName, useApi } from '../../helpers';

var tools = express.Router();

tools.post('/user/:userID/project/:projectID/resources/tools/extractClip', async (req, res) => {
try {
    let {error, resourcesPath, writeResourcesData, resourcesData, outputsPath} = useApi(req);
    if(error) throw error;
    const { name, start, end, resourceData: { fileName: inputFileName }, mode } = req.body;
    const inputFilePath = join(resourcesPath, inputFileName);

    if(mode == PROCESS_MODES['SAVE_INDEPENDENT']){
        let outputId = uniqueName(name);
        let outputFileName = outputId+parse(inputFileName).ext;
        let outputFilePath = join(resourcesPath, outputFileName);

        await ( async ()=>{
            console.log(inputFilePath,
                { start, end },
                outputFilePath)
            let err = await extractClip(
                inputFilePath,
                { start, end },
                outputFilePath
            )
            
            if(err) throw err;
        })()
        console.log("LISTO")
        let [metadata, err ] = await getMetadata(outputFilePath);
        if(err) throw err;

        let ext = parse(outputFileName).ext;
        
        let fileData: Resource = {
            name,
            id: outputId,
            fileName: outputFileName, 
            uploaded: new Date(),
            mimetype: (commonMimetypes[ext])? `${commonMimetypes[ext]}/${ext.replace('.', '')}`: 'unknown',
            size: metadata.format.size,
            metadata: metadata
        }     
        
        resourcesData.push(fileData)
        writeResourcesData(resourcesData)
        res.json(fileData);
    }else if(mode == PROCESS_MODES['PROCESS_INDEPENDENT']){
        let outputId = uniqueName(name);
        let outputFileName = outputId+parse(inputFileName).ext;
        let outputFilePath = join(outputsPath, outputFileName);

        await ( async ()=>{
            console.log(inputFilePath, { start, end }, outputFilePath)
            let err = await extractClip(
                inputFilePath,
                { start, end },
                outputFilePath
            )
            if(err) throw err;
            
            res.json({status: 'done', outputFile: outputFilePath});
        })()
    }

} catch (error) { console.error(error); res.status(400).send(error);}
})

export {tools}