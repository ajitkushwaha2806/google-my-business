import dbConnect from "@/lib/db";
import * as argon2 from "argon2";
import { User } from "@/models/User";
import ImageAsset from "@/models/Image";
import Restaurant from "@/models/Restaurant";

export class UserService {
    static async getAll(restaurantId) {
        await dbConnect();
        return await User.find({ restaurant: restaurantId })
            .populate("image")
            .select("-passwordHash")
            .sort({ createdAt: -1 })
            .lean();
    }

    static async create(restaurantId, { name, phone, password, status, image }) {
        await dbConnect();

        if (!name || !phone || !password) {
            throw new Error("Name, phone, and password are required");
        }

        const existingUser = await User.findOne({ phone, restaurant: restaurantId });
        if (existingUser) {
            throw new Error("A user with this phone number already exists for this restaurant");
        }

        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 14,
            timeCost: 2,
            parallelism: 1
        });

        const isInvalidImage = !image || ["", "null", "undefined"].includes(String(image));
        const finalImage = isInvalidImage 
            ? (await Restaurant.findById(restaurantId).lean())?.logo || null 
            : image;

        const newUser = await User.create({
            name,
            phone,
            passwordHash,
            image: finalImage,
            restaurant: restaurantId,
            status: status || "ACTIVE"
        });

        return await User.findById(newUser._id).populate("image").select("-passwordHash");
    }

    static async update(restaurantId, userId, { name, phone, password, status, image }) {
        await dbConnect();

        const user = await User.findOne({ _id: userId, restaurant: restaurantId });
        if (!user) {
            throw new Error("User not found");
        }

        if (status) user.status = status;
        if (name) user.name = name;
        if (phone) user.phone = phone;

        if (image !== undefined) {
            const isInvalidImage = !image || ["", "null", "undefined"].includes(String(image));
            user.image = isInvalidImage 
                ? (await Restaurant.findById(restaurantId).lean())?.logo || null 
                : image;
        }

        if (password) {
            user.passwordHash = await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 14,
                timeCost: 2,
                parallelism: 1
            });
        }

        await user.save();
        return await User.findById(userId).populate("image").select("-passwordHash");
    }

    static async delete(restaurantId, userId) {
        await dbConnect();

        const user = await User.findOneAndDelete({ _id: userId, restaurant: restaurantId });
        if (!user) {
            throw new Error("User not found");
        }

        return true;
    }
}
