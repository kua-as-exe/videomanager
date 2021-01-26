import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4} from "uuid";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import {generate} from 'randomstring';

export const kdenliveProjectBase = "./helpers/project-base.kdenlive";

export const users:{
  [userID:string]: string
} = {
  //'Cranki220': "C:/ARREOLA/Media/Cranki220/MyVideos"
  'Cranki220': "./contents/users/Cranki220"
}

export const existUser = (userID: string) => users[userID]? true: false;
export const createDirIfNotExists = (path: string) => !existsSync(path)? mkdirSync(path, {recursive: true}): null;

export interface Resource {
  uploaded: Date,
  name: string, 
  id: string,
  fileName: string,
  size: number,
  mimetype: string,
  metadata?: object
}


export const useApi = (req: Request, res?: Response, next?: NextFunction) => {
  let userID = String(req.params.userID);
  let directory = users[userID];
  let projectsDir = join(directory,'projects');
  createDirIfNotExists(projectsDir);

  let projectID = String(req.params.projectID);
  let projectPath, resourcesPath, resourcesJSONPath, outputsPath, error, resourcesData:Resource[], writeResourcesData,trashPath;
  if(!!req.params.projectID){
    //    return { userID, directory, projectsDir }
  console.log(projectID)
  
  projectPath = join(projectsDir, projectID);

  resourcesPath = join(projectPath, 'resources');
  resourcesJSONPath = join(resourcesPath, 'resources.json');

  trashPath = join(resourcesPath, 'trash');
  createDirIfNotExists(trashPath)
  
  
  outputsPath = join(projectPath, 'outputs');
  createDirIfNotExists(outputsPath)

  error = null
  resourcesData  = []
  try{
    let string = readFileSync(resourcesJSONPath).toString();
    resourcesData = JSON.parse( string != 'undefined'? string : '[]');
  }catch(e) { error = new Error(e) }

writeResourcesData = (data: Resource[]): [error: Error] => {
    if(data == undefined) throw Error("Data is undefined")
    writeFileSync(resourcesJSONPath, JSON.stringify(data, null, 2));
    return [error];
  }
}

  return {
    error,
    userID,
    directory,
    projectsDir,
    projectPath,
    projectID,
    outputsPath,
    resourcesPath,
    resourcesJSONPath,
    resourcesData,
    writeResourcesData,
    trashPath
  }
  
}

export const PROCESS_MODES = {
  SAVE_INDEPENDENT: 'Guardar por separado',
  PROCESS_INDEPENDENT: 'Procesar por separado',
}

export const toTileCase = (phrase):string => {
  return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

// export const uniqueName = (name) => toTileCase(name).replace(/ /g, '')+'_'+uuidv4()
export const uniqueName = (name) => toTileCase(name).replace(/ /g, '')+'_'+generate(4)