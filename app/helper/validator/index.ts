import { validateEnvType } from "./type";

export const getEnv = ({ name, value }: validateEnvType) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}