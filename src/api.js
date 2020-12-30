//export const api = '/api/'

const api = {
    user: (userID)=>{
        let pre = `/api/user/${userID}`

        return ({
            projects: ()=>({
                get: ()=>`${pre}/projects`,
                new: (projectName)=>`${pre}/projects/new?name=${projectName}`
            }),
            project: (projectID) => {
                pre = `${pre}/project/${projectID}`
                
                return({
                    get: ()=>pre,
                    delete: ()=>`${pre}/delete`,
                    outputs: () => `${pre}/outputs`,
                    resources: ()=>{
                        pre = `${pre}/resources`

                        return ({
                            get: () => pre,
                            refresh: ()=> `${pre}/refresh`,
                            upload: ()=> `${pre}/upload`,
                            delete: () => `${pre}/delete`,
                            mergeVideos: () => `${pre}/mergeVideos`
                        })
                    }
            })}
        })
    }   
}

const newProject = () => api+'/projects/new';
const getProject = (id='') => `${api}/project/get?id=${id}`; 
const deleteProject = (id='') => `${api}/project/delete?id=${id}`; 

const uploadProjectResources = (id='') => `${api}/project/resources/upload?id=${id}`; 
const getProjectResources = (id='') => `${api}/project/resources/get?id=${id}`; 
const deleteProjectResources = (id='', resourceID='') => `${api}/project/resources/delete?id=${id}&resourceID=${resourceID}`; 

export {
    api, 
    newProject,
    getProject,
    deleteProject,
    uploadProjectResources,
    getProjectResources,
    deleteProjectResources
}