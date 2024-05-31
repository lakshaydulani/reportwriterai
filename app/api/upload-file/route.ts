import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const base64URL = requestBody.file;  // Accessing 'file' from the request body

        if (!base64URL) {
            return new Response("base64URL not found", { status: 400 });
        }

        const apiURL = 'https://functionappupload.azurewebsites.net/api/functiontest?';

        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file: base64URL }),  // Sending the 'file' as 'base64URL'
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("Error response from external API:", errorText);
            return new Response("You encountered an error: " + errorText, { status: apiResponse.status });
        }

        const data = await apiResponse.json();
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Error occurred:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
