import * as express from 'express';
import { statSync } from 'fs';
import * as uuid from 'uuid';
import { toTileCase, kdenliveProjectBase, uniqueName, useApi } from '../helpers';
const {readdirSync, mkdirSync, writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const fetch = require('node-fetch');

var projects = express.Router();

projects.get('/user/:userID/projects', (req, res, next) => {
    console.log(req.url)
    try{
     const {projectsDir} = useApi(req);
        let projectsPaths = readdirSync(join(projectsDir)).filter(f => statSync(join(projectsDir, f)).isDirectory());
        let projectsData = projectsPaths.map( path => JSON.parse(readFileSync(join(projectsDir, path, 'project.json')).toString()))
        res.send(projectsData);
    }catch(e){
        console.log(e)
    }
});

projects.post('/user/:userID/projects/new', async (req, res) => {
    let name = String(req.body.name);
    const {projectsDir} = useApi(req);
    
    let prefix = uniqueName(name);
    let thumbnail = (await fetch("http://source.unsplash.com/random/600x400")).url || "";
    let project = {
        id: prefix,
        name,
        prefix,
        tags: [],
        createdAt: new Date(),
        lastEdit: new Date,
        thumbnail,
        youtubeData: {
            name: name,
            description: 'Video description'
        }
    }

    let projectPath = join(projectsDir, project.id);
    mkdirSync(projectPath);
    writeFileSync(join(projectPath, 'project.json'), JSON.stringify(project, null, 2))

    let defaultDirs = ['resources']
    defaultDirs.forEach(dir => mkdirSync(join(projectPath, dir)));

    let resourcesJSON = [];
    writeFileSync(join(projectPath, 'resources', 'resources.json'), JSON.stringify(resourcesJSON, null, 2));

    let xmlRoot = join(projectPath);
    let xml = readFileSync(kdenliveProjectBase).toString();
    
    let templateKeys = {
        'ROOT': xmlRoot
    }
    Object.keys(templateKeys).forEach( key => {
        xml = xml.replace(new RegExp(key, "g"), templateKeys[key]);
    })
    let xmlPath = join(projectPath, prefix+'.kdenlive');
    writeFileSync(xmlPath, xml);

    res.send(project);
})

export default projects