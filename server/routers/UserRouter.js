const router = require("express").Router();
const helper = require('../helpers');
const validator = require('../helpers/validators');
var http = require('http')
const DBHelper = require('../db');

/**
 * Register route
 */
router.post('/api/user', async (req, res, next) => {
    try{
        const data = req.body;
        if(!validator.userValidator.createUserValidator(data.FirstName,data.LastName,data.Email, data.password)){
            res.status(400); // Returning bad request
            res.json({Data: null, Status: false, Message: 'Invalid parameters!'});
            return;
        }
        let result = await helper.user.createUser(data.FirstName,data.LastName,data.Email, data.password);
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
        if(!validator.userValidator.createLoginValidator(data.Email, data.password)){
            res.status(400); // Returning bad request
            res.json({Data: null, Status: false, Message: 'Invalid parameters!'});
            return;
        }
     
        let result = await helper.user.loginUser(data.Email, data.password);
        res.status(200); // Returning created
        res.json(result);

    }catch(err){
        res.status(400);
        res.json(err);
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
        res.json({Status: true, Message: 'Authorization denied!', Data: results});
        
    }catch(err){
        res.status(400);
        res.json({Status: false, Message: 'Unexpected error!', Data: null});;
    }
});








module.exports = router;