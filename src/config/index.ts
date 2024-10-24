import path = require("path")
import * as dotenv from 'dotenv'

const envPath = path.join(__dirname, '..', '..', '.env')
console.log(envPath)
dotenv.config({ path: envPath })

export default {
    port: process.env.PORT,
    database: {
        host: process.env.DATABASE_HOST,
        name: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    },
    jwt: process.env.JWT_Secret,
    smtp: {
        from: process.env.SMTP_FROM,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        port: process.env.SMTP_PORT,
        host: process.env.SMTP_HOST,
    }
}