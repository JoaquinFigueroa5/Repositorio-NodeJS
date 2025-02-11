import User from "../users/user.model.js";
import Pet from "../pet/pet.model.js";
import Appoit from "./appointment-model.js"

export const saveAppoit = async (req, res) => {
    try{
        console.log("Hola")
        const data = req.body;
        const user = await User.findOne({ email: data.email});
        const pet = await Pet.findOne({ name: data.name});

        if(!user || !pet){
            return res.status(404).json({
                success: false,
                msg: "Property not found"
            })
        }

        const appoit = new Appoit({
            ...data,
            owner: user._id, 
            pet: pet._id
            
        });

        await appoit.save();

        res.status(200).json({
            success: true,
            appoit
        })

    } catch(error){
        console.log("hola")
        res.status(500).json({
            success: false,
            msg: "Error to save the appointment",
            error
        })
    }
}

export const getAppoit = async(req, res) => {
    const { limit = 10, desde = 0 } = req.query;
    const query = { status: true };

    try{
        const appoits = await Appoit.find(query)
            .skip(Number(desde))
            .limit(Number(limit));
        
        const appoitWithInfo = await Promise.all(appoits.map(async(appoit) =>{
            const pet = await Pet.findById(appoit.pet);
            const owner = await User.findById(appoit.owner);
            return{
                ...appoit.toObject(),
                pet: pet ? pet.name : "Property not found 1",
                owner: owner ? owner.name : "Property not found 2"
            }
        }));

        const total = await Appoit.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            appoits: appoitWithInfo
        })
    }catch(error){
        res.status(500).json({
            success: false,
            msg: "Error to the get the appointment",
            error
        })
    }
}

export const searchPet = async (req, res) => {
    const { id } = req.params;
    try {

        const appoit = await Appoit.findById(id);

        if(!appoit){
            return res.status(400).json({
                success: false,
                msg: "Apoit not found"
            })
        }

        const owner = await User.findById(appoit.owner);
        const pet = await Pet.findById(appoit.pet);

        res.status(200).json({
            success: true,
            appoit: {
                ...appoit.toObject(),
                pet: pet ? pet.name : "Pet not found",
                owner: owner ? owner.name : "Owner not found"
            }
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to find a pet',
            error
        })
    }
}

export const deleteAppoit = async(req, res) => {
    const { id } = req.params;

    try {

        await Appoit.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            sucess: true,
            msg: "Appoit eliminate successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error to eliminate this appoit"
        })
    }
}

export const updateAppoit = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data} = req.body;

        const appoit = await Appoit.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Cita actualizada',
            appoit
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la cita',
            error
        })
    }
}