import { response, request } from "express";
import argon2 from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0} = req.query;
        const query = { state: true};

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            sucess: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found'
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const updateUser = async (req, res = response) => {
    try{
        const { id } = req.params;
        const { _id, email, ...data} = req.body;

        if(password){
            data.password = await hash(password);
        }
            
        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            sucess: true,
            msg: 'Usuario actualizado',
            user
        })

    }catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el user',
            error
        })
    }
}

export const deleteUser = async (req, res) =>{
    try {
        
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });

        const authenticatedUser = req.user;

        res.status(200).json({
            sucess: true,
            msg: "Usuario desactivado",
            user,
            authenticatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar usuario',
            error
        })
    }
}

export const updatePassword = async (req, res) => {
    try{
        const { id } = req.params;
        const { password } = req.body;
        
        const hashedPassword = await argon2.hash(password);
                    
        const user = await User.findByIdAndUpdate(id, {password: hashedPassword}, {new: true});

        res.status(200).json({
            sucess: true,
            msg: 'Contraseña del usuario actualizada',
            user
        })

    }catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la contraseña del user',
            error
        })
    }
}