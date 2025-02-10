import User from "../users/user.model.js";
import Pet from "./pet.model.js";

export const savePet = async (req, res) =>{
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email});

        if(!user){
            return res.status(404).json({
                sucess: false,
                message: "Property not found"
            })
        }

        const pet = new Pet({
            ...data,
            keeper: user._id
        });

        await pet.save();

        res.status(200).json({
            success: true,
            pet
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error to save the pet",
            error
        })
    }
}

export const getPets = async(req, res) =>{
    const { limit = 10, desde = 0} = req.query;
    const query = { status: true };

    try {
        const pets = await Pet.find(query)
            .skip(Number(desde))
            .limit(Number(limit));

        const petWithOwnerNames = await Promise.all(pets.map(async (pet) =>{
            const owner = await User.findById(pet.keeper);
            return{
                ...pet.toObject(),
                keeper: owner ? owner.name : "Property not found"
            }
        }));

        const total = await Pet.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            pets: petWithOwnerNames
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error to the get pets",
            error
        })
    }
}

export const searchPet = async (req, res) => {
    const { id } = req.params;
    try {

        const pet = await Pet.findById(id);

        if(!pet){
            return res.status(404).json({
                success: false,
                msg: "Pet didn't found"
            })
        }

        const owner = await User.findById(pet.keeper);

        res.status(200).json({
            sucess: true,
            pet: {
                ...pet.toObject(),
                keeper: owner ? owner.name : "Owner not found"
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to find a pet'
        })
    }
}

export const deletePet = async (req, res) => {
    const { id } = req.params;

    try {
        
        await Pet.findByIdAndUpdate(id, { status: false});

        res.status(200).json({
            sucess: true,
            msg: "Pet eliminate successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error to eliminate a pet"
        })
    }
}

export const updatePet = async (req, res) => {
    try{
        const { id } = req.params;
        const { _id, password, email, ...data} = req.body;

        if(password){
            data.password = await hash(password);
        }
            
        const user = await Pet.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            sucess: true,
            msg: 'Mascota actualizado',
            user
        })

    }catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la mascota',
            error
        })
    }
}