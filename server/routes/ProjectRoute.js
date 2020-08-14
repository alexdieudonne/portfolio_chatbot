const express = require('express');
const router = express.Router();
const dialogflow = require('dialogflow');
const Users = require("../models/Users");
const Projects = require("../models/Projects");
const config = require('../config/keys');

var variable = require('../config/variables');

const helper = require('../helpers');
const validator = require('../helpers/validators');
var http = require('http')
const DBHelper = require('../db');

const projectId = config.googleProjectID
const sessionId = config.dialogFlowSessionID
const languageCode = config.dialogFlowSessionLanguageCode


// Create a new session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// router.post('/textQuery', async (req, res) => {
//     //We need to send some information that comes from the client to Dialogflow API 
//     // The text query request.
//     const request = {
//         session: sessionPath,
//         queryInput: {
//             text: {
//                 // The query to send to the dialogflow agent
//                 text: req.body.text,
//                 // The language used by the client (en-US)
//                 languageCode: languageCode,
//             },
//         },
//     };

//     // Send request and log result
//     const responses = await sessionClient.detectIntent(request);
//     console.log('Detected intent');
//     const result = responses[0].queryResult;
//     console.log(`  Query: ${result.queryText}`);
//     console.log(`  Response: ${result.fulfillmentText}`);

//     res.send(result)
// })

router.get('/projects/:id', async (req, res) => {

    Users.hasMany(Projects, { as: "Projects", foreighkey: 'userId'});
    Projects.belongsTo(Users, { as:"Users", foreighkey: "userId"});

    const errHandler = (err)=>{
        console.error("Error", err)
    };

    const user = await  Users.create({name: "poulet2.0", password: "blabla20", email: "poulet20@gmail.com"}).catch(errHandler);
    const project = await  Projects.create({name: "laravel", used_language: "Laravel, mysql", description:"C'était un super projet de ouf ca mère"}).catch(errHandler);

    const users = Users.findAll({ where: {username: 'poulet2.0'}, include:[ {model: Projects, as:"Projects"} ] }).catch(errHandler);

    //console.log("poulet 2.0 Projects:", users)

    res.send(users)
})



/**
 * Register route
 */
router.post('/api/user', async (req, res, next) => {
    try{
        const data = req.body;
        if(!validator.userValidator.createUserValidator(data.name,data.username,data.email, data.password)){
            res.status(400); // Returning bad request
            res.json({Data: null, Status: false, Message: 'Invalid parameters!'});
            return;
        }
        let result = await helper.user.createUser(data.name,data.username,data.email, data.password);
        res.status(201); // Returning created
        res.json(result);
    }catch(err){
        res.status(400);
        res.json(err);
    }
});

/**
 * Login route
 */
router.post('/api/user/token', async (req, res, next) => {
    try{
        const data = req.body;
        if(!validator.userValidator.createLoginValidator(data.username, data.password)){
            res.status(400); // Returning bad request
            res.json({Data: null, Status: false, Message: 'Invalid parameters!'});
            return;
        }
        // console.log('here')
        let result = await helper.user.loginUser(data.username, data.password);
        res.status(200); // Returning created
        res.json(result);

    }catch(err){
        res.status(400);
        res.json({"error":"Something went wrong"});
    }
});

/**
 * Update username route
 */

router.put('/api/username/:id', async (req, res, next) => {
    try{
        const data = req.body;
        console.log(req.params.id);
        //console.log(data)
        // if(!validator.userValidator.usernameValidator(data.Email, data.username)){
        //     res.status(400); // Returning bad request
        //     res.json({Data: null, Status: false, Message: 'Invalid parameters'});
        //     return;
        // }
        let result = await helper.user.updateUser(req.params.id, data.username);
        res.status(200); // Returning created
        res.json(result);
    }catch(err){
        res.status(400);//updateUsername
        console.log(res)
        res.json(err);
    }
});

/**
 * Get users
 */
router.get('/api/users', async (req, res, next) => {
    let token_data;
    try{
        token_data = await helper.auth.authantication(req);
    }catch(err){
        res.status(401);
        res.json({Status: false, Message: 'Authorization denied!', Data: null});
        return;
    }
    try{    
        if(req.query.id){ // If only one user
            let user = await DBHelper.user.getUserByIdForWithoutPassword(req.query.id);
            res.status(200);
            res.json({Status: false, Data: user[0], Message: null});
            return;
        }
        let results = await DBHelper.user.getUserWitoutUser(token_data.data.id);
        res.status(200);
        res.json({Status: true, Message: 'Authorization denied!', Data: null});
        
    }catch(err){
        res.status(400);
        res.json({Status: false, Message: 'Unexpected error!', Data: null});;
    }
});

/////////////////////////// Projects Routes ///////////////////////////////

/**
 * Create Project route
 */
router.post('/api/project', async (req, res, next) => {
    let token_data;
    try{
        token_data = await helper.auth.authantication(req);
    }catch(err){
        res.status(401);
        res.json({Status: false, Message: 'Authorization denied!', Data: null});
        return;
    }
    try{
        const data = req.body;
        if(!validator.projectValidator.createProjectValidator(data.name,data.date,data.used_language, data.description)){
            res.status(400); // Returning bad request
            res.json({Data: null, Status: false, Message: 'Invalid parameters!'});
            return;
        }
        let result = await helper.project.createProject(data.name,data.date,data.used_language, data.description);
        res.status(201); // Returning created
        res.json(result);
    }catch(err){
        res.status(400);
        res.json(err);
    }
});


/**
 * Show Projects route
 */
router.get('/api/projects', async (req, res, next) => {
    let result;
    try{
        result = await helper.project.showProjects();
        
        res.status(200); 
        res.json(result);
    }catch(err){
        res.status(400);
        res.json(err);
    }
});

/**
 * Show Project route
 */
router.get('/api/project:id', async (req, res, next) => {
    let result;
    var id = req.params.id;
    try{
        
        result = await helper.project.viewProject(id);
        
        res.status(200); 
        res.json(result);
    }catch(err){
        res.status(400);
        res.json(err);
    }
});

/**
 * Update Project route
 */
router.put('/api/project:id', async (req, res, next) => {
   //console.log(variable.value())
    let token_data;
    var id = req.params.id;
    let result;
    try{
        token_data = await helper.auth.authantication(req);
    }catch(err){
        res.status(401);
        res.json({Status: false, Message: 'Authorization denied!', Data: null});
        return;
    }
    try{
        
        const data = req.body;
     
        if(data.name){
             result = await helper.project.updateProject(id,data.name,null,null, null);
        } if(data.date){
            result = await helper.project.updateProject(id,null,data.date,null, null);
        } if(data.used_language){
            result = await helper.project.updateProject(id,null,null,data.used_language, null);
        } if(data.description){
            result = await helper.project.updateProject(id,null,null,null, data.description);
        }
        
        res.status(201); // Returning created
        res.json(result);
    }catch(err){
        res.status(400);
        res.json(err);
    }
});

/**
 * Delete Project route
 */
router.post('/api/project:id', async (req, res, next) => {
    let token_data;
    var id = req.params.id;
    let result;
    try{
        token_data = await helper.auth.authantication(req);
    }catch(err){
        res.status(401);
        res.json({Status: false, Message: 'Authorization denied!', Data: null});
        return;
    }
    try{
        const data = req.body;
        if(!validator.projectValidator.deletebyidValidator(data.id)){
            res.status(400); // Returning bad request
            res.json({Data: null, Status: false, Message: 'Invalid parameters!'});
            return;
        }
        result = await helper.project.deleteProject(id);

        res.status(201); // Returning created
        res.json(result);
    }catch(err){
        res.status(400);
        res.json(err);
    }
});





module.exports = router;
