import express = require('express');

import { serviceContainer } from '../config/inversify.config';

import { DB, DBInterface } from "../types/db.types";
import { User, UserLimit } from "../types/user.types";

import { createUserValidationMiddleware, updateUserValidationMiddleware } from '../utils/user-validation.middleware';

import { UsersService } from "../services/users.service";

const router = express.Router();

const DBInstance = serviceContainer.get<DBInterface>(DB);
const UserServiceInstance = new UsersService(DBInstance);

router.get('/', async ( req: express.Request, res: express.Response, next ) => {
    try {
        const { loginSubstringIn = '', limit = UserLimit.DEFAULT} = req.query;

        // @ts-ignore
        const users: User[] | null = await UserServiceInstance.getUsersByLoginSubstr({ loginSubstringIn, limit });

        if ( users )
            return res.status(200).json({ users });

        return next({
            statusCode: 400,
            message: 'Bad request!'
        });
    }
    catch( error ){
        next(error);
    }
});

router.get('/:id', async ( req: express.Request, res: express.Response, next ) => {
    try {
        const { id } = req.params;
        const user: User | null = await UserServiceInstance.getUserById(id);

        if( user )
            return res.status(200).json({ user: {
                    login: user.login,
                    age: user.age
                }
            })
        return next({
            statusCode: 404,
            message: 'User not found!'
        });
    }
    catch( error ){
        next(error);
    }
});

router.post('/', createUserValidationMiddleware, async ( req: express.Request, res: express.Response, next ) => {
    try{
        const { login, password, age } = req.body;
        const user = await UserServiceInstance.createUser({ login, password, age });


        if( user )
            return res.status(200).json({ user: {
                    id: user.id,
                    login: user.login,
                    age: user.age
                }
            })

        return next({
            statusCode: 400,
            message: 'User is already exists!'
        });
    }
    catch( error ){
        next(error);
    }
});

router.put('/:id', updateUserValidationMiddleware, async ( req: express.Request, res: express.Response, next ) => {
    const { id } = req.params;
    try{
        const updatedUser = await UserServiceInstance.updateUser({ id, ...req.body });

        if( updatedUser )
            return res.status(200).json({ user: {
                    id: updatedUser.id,
                    login: updatedUser.login,
                    age: updatedUser.age
                }
            });

        return next({
            statusCode: 404,
            message: 'User not found!'
        });
    }
    catch( error ){
        next(error);
    }
});

router.delete('/:id', async ( req: express.Request, res: express.Response, next ) => {
    try{
        const { id } = req.params;
        const result = await UserServiceInstance.deleteUser( id );

        if( result )
            return res.status(200).json({
                message: 'User successfully removed!'
            })
        return next({
            statusCode: 404,
            message: 'User not found!'
        });
    }
    catch( error ){
        next(error);
    }
});

export default router;