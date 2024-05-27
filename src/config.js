import { config } from "dotenv";

config()

export const {
    SECRET_KEY,
    GITHUB_CID,
    GITHUB_SECRET,
    GOOGLE_SECRET,
    GOOGLE_CID,
    MONGOOSE_URL,
} = process.env

