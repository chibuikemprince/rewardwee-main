import joi from "joi";

export const createTeams = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    user_id: joi.string().required()
});


export const updateTeams = joi.object({
    name: joi.string(),
    description: joi.string()
});


export const getTeamsById = joi.object({
    team_id: joi.string().required() 
});


export const getTeamsByName = joi.object({
    name: joi.string().required(),
    page: joi.number() 
});


export const getTeamsByUser = joi.object({
    org_user_id: joi.string().required(),
    page: joi.number() 
});


export const deleteTeam = joi.object({
    user_id: joi.string().required(),
    team_id: joi.string().required()
});



