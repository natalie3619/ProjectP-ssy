require('dotenv').config();

const { Client } = require("pg");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { email } = JSON.parse(event.body);

    if (!email || !email.includes("@")) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid email" }),
        };
    }

    const client = new Client({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    });

    try {
        await client.connect();
        await client.query("INSERT INTO emails (email) VALUES ($1)", [email]);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Database error" }),
        };
    } finally {
        await client.end();
    }
};
