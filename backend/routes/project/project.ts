import * as express from 'express';
import { useApi } from '../helpers';
import { resources } from "./resources";

const { readFileSync, existsSync, rmdirSync} = require('fs');
const { join } = require('path');

var project = express.Router();

project.get('/user/:userID/project/:projectID', (req, res, next) => {
    console.log("A")
    const {projectPath} = useApi(req);

    try {
        let projectData = JSON.parse(readFileSync(join(projectPath, 'project.json')).toString());
        res.send(projectData);
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
});

project.post('/user/:userID/project/:projectID/delete', (req, res) => {
    let status = '';
    const {projectPath, projectID} = useApi(req);

    console.log("Deleting id: "+ projectID);
    try {
        rmdirSync(projectPath, { recursive: true });
        status = projectID+' deleted';
        console.log(status)
        res.send({status});
    } catch (error) {
        status = 'Error while deleting: ' + error;
        console.log(status)
        res.status(400).send({error: status});
    }
})

project.use(resources);

export default project;
