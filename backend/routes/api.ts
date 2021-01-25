import project from './project/project';
import projects from './projects/projects';
import * as express from 'express';
import { join } from 'path';
import { existUser, useApi, users } from './helpers';
import { existsSync, readdirSync } from 'fs';

var api = express.Router();

/* Object.keys(users).forEach( user => {
    api.use(`/user/${user}/media`, express.static(join(users[user],'projects')));
}) */
Object.keys(users).forEach( user => {
    let projectsDir = join(users[user], 'projects')
    api.use(`/user/${user}/project`, express.static(projectsDir));
    //let projects = readdirSync(projectsDir);
    /* projects.forEach( project => {
        let projectResourcesUrl = `/user/${user}/project/${project}/resources`;
        let projectResourcesDir = join(projectsDir, project, 'resources');
        console.log(projectResourcesUrl, projectResourcesDir)
        api.use(projectResourcesUrl, express.static(projectResourcesDir));
    })   */
})


api.use('/user/:userID', (req, res, next)=>{
    let userID = String(req.params.userID);
    if(!existUser(userID))
        {res.status(400).send({error: 'User not exists'}); return;}
        next()
})

api.use('/user/:userID/project/:projectID', (req, res, next)=>{
    console.log(req.params)
    const {projectID, projectPath} = useApi(req);
    
    if(projectID === "undefined")
        {res.status(400).send({error: 'No project id provided'}); return;}
    
        if(!existsSync(projectPath))
        {res.status(400).send({error: 'Project does not exists'}); return;}

    next()
})
api.use(project);
api.use(projects);

export {api};
