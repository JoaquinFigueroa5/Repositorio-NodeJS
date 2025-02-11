import Role from '../role/role.model.js';
import Usuario from '../users/user.model.js';
import Pet from '../pet/pet.model.js';
import Appoit from '../appointment/appointment-model.js'

export const esRolValido = async(role = '') => {
    const existeRol = await Role.findOne({role});

    if(!existeRol){
        throw new Error(`El rol ${role} no existe en la base de datos`)
    }
}

export const existenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        throw new Error(`El correo ${correo} ya existe en la base de datos`)
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await Usuario.findById(id);

    if(!existeUsuario){
        throw new Error(`El usuario con el id ${id} no existe en la base de datos`)
    }
}

export const existePetById = async (id = '') => {
    const existePet = await Pet.findById(id);

    if(!existePet){
        throw new Error(`La mascota con el id ${id} no existe en la base de datos`)
    }
}

export const existeAppoitById = async (id = '') => {
    const existeAppoit = await Appoit.findById(id);
    
    if(!existeAppoit){
        throw new Error(`La cita con el id ${id} no existe en la base de datos`)
    }
}