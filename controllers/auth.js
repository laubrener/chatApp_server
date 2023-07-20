const { response } = require('express');
const User  = require('../models/user');
const bcrypt  = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');


const createUser = async (req, res = response) => {
    
    const {email, password} = req.body;

    try {
        const emailExist = await User.findOne({email});
        if(emailExist){
            return res.status(400).json({
                ok:false,
                msg:'credentials are not valid'
            })
        }

        const user = new User(req.body);

        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // generar mi token
        const token = await generateJWT(user.id);
    
        res.json({
            ok:true,
            user: user, token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "error"
        })
    }

}

const login = async (req, res = response) => {

    const { email, password} = req.body;

    try{
        const userDB = await User.findOne({email});
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email not found'
            });
        }
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'invalid password'
            });
        }
        // generar jwt
        const token = await generateJWT(userDB.id);

        res.json({
                ok:true,
                user: userDB,
                token

        })  
    } catch(err){
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: "error"
        })
    }
}

const renewToken = async (req, res = response) => {
    
    const uid = req.uid;
    const token = await generateJWT(uid);
    const user = await User.findById(uid);
    
    res.json({
        ok:true,
        user,
        token
    })
}

module.exports = {createUser, login, renewToken}