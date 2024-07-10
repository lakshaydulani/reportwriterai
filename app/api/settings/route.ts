import { NextResponse } from "next/server";

export async function GET(request, response) {
    const apiURL = `https://ai-report-writer.azurewebsites.net/api/get_sections`;

    try {
        const apiResponse = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            // console.error("Error response from external API:", errorText);
            return 
        }
        
        const data = await apiResponse.json();
        
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Error occurred:", err);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function POST(request) {
    try {
        const req = await request.json();

        const apiURL = 'https://ai-report-writer.azurewebsites.net/api/update_sections';

        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("Error response from external API:", errorText);
            return new NextResponse("You encountered an error: " + errorText, { status: apiResponse.status });
        }

        const data = await apiResponse;
        
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
