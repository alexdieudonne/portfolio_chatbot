const encrypt = require('./criypto');
const DBAccess = require('../db');
const auth = require('./auth');

/**
 * Register user (call for each registeration)
 * @param {string} name name of project
 * @param {string} date date of project
 *  @param {string} used_language used_language of project
 * @param {string} description description of project
 */
const createProject = (name, date, used_language, description) => {
    return new Promise(async (resolve, reject) => {
        try{
             let names = await DBAccess.project.getUserByName(name);
             if(names.length > 0 ) return reject({Status: false, Message: 'Username must be unique!', Data: null});
            let result = await DBAccess.project.createProject(name, date, used_language, description);
            resolve({Status: true, Message: 'Project created successfully!', Data: null});
        }catch(err){
            reject(err);
        }
    })
}

/**
 * Update user (call for Login)
 * @param {string} name name of project
 * @param {string} date date of project
 * @param {string} used_language used_language of project
 * @param {string} description description of project
 */
const updateProject = (id, name, date, used_language, description) => {
    return new Promise(async (resolve, reject) => {
        try{
            let project = await DBAccess.project.getProjectbyid(id);
            
            if(project.length == 0 ) 
            return reject({Status: false, Message: "Project doesn't exist!", Data: null});
            if(name){ 
                await DBAccess.project.updateProject(id, name,null,null,null);
            } if(date){
                await DBAccess.project.updateProject(id,null, date,null,null);
            } if(used_language){
                await DBAccess.project.updateProject(id,null,null, used_language,null);
            } if(description){
                await DBAccess.project.updateProject(id,null,null,null, description);
            }
            
            let projec = await DBAccess.project.getProjectbyid(id);
         // console.log(result)
            resolve({Status: true, Message: 'Project updated successfully!', Data: null, project:projec});
        }catch(err){
            reject(err);
        }
    })
}


/**
 * Login for user
 * @param {string} id id of project
 */
const deleteProject = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const users = await DBAccess.project.getProjectbyid(id);
            if(users.length == 0 )  // Is user exist?
                return reject({Status: false, Message: 'There is no project with this id !', Data: null});
            const response = await DBAccess.project.deleteProjectById(id);
            resolve({Status: true, Message: 'Project successfully deleted!', Data: response});
        }catch(err){
            reject(err);
        }
    })
}


/**
 * Show Projects
 */
const showProjects = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const response = await DBAccess.project.showProjects();
            console.log(response)
            resolve({Status: true, Message: 'This is all my projects', Projects: response});
        }catch(err){
            reject(err);
        }
    })
}

/**
 * View Project
 */
const viewProject = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const response = await DBAccess.project.getProjectbyid(id);
            if(response.length == 0 ) 
                reject({Status: true, Message: 'no existing project', Projects: response});
            resolve({Status: true, Message: 'This is the details', Projects: response});
        }catch(err){
            reject(err);
        }
    })
}



module.exports = {
    updateProject,
    createProject,
    deleteProject,
    showProjects,
    viewProject,
}