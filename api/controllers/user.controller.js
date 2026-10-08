import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
    res.json({
        message: "API routing is working",
    });
};

export const updateUser = async (req, res, next) => {
    if (String(req.user.id) !== req.params.id)
        return next(errorHandler(401, "You can only Update your own Account!"));

    try {
        const updates = {};
        for (const field of ["username", "email", "avatar"]) {
            if (typeof req.body[field] === "string") {
                updates[field] = req.body[field];
            }
        }

        if (typeof req.body.password === "string" && req.body.password.length > 0) {
            updates.password = bcryptjs.hashSync(req.body.password, 10);
        }

        if (Object.keys(updates).length === 0) {
            return next(errorHandler(400, "No profile changes provided."));
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true },
        );

        if (!updatedUser) {
            return next(errorHandler(404, "User not found."));
        }

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    if (String(req.user.id) !== req.params.id) {
        return next(errorHandler(401, "You can only view your own listings!"));
    }

    try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only DELETE your own account!'))

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('acces_token');
        res.status(200).json("User has been DELETED!");
    } catch (error) {
        next(error)        
    }
}