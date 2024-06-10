import { NextResponse } from "next/server";

export async function GET(request, response) {
    const { searchParams } = new URL(request.url);
    const fieldValue = searchParams.get('field').toLowerCase();
    // console.log("fieldValue is ", fieldValue);

    const apiURL = `https://functionappupload.azurewebsites.net/api/settingsfields?field=${fieldValue}`;

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
        // console.log("apiResponse is .....", apiResponse);
        const data = await apiResponse.json();
        // console.log('External API response data:', data);
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
        console.log('Request content is:', req);

        const apiURL = 'https://functionappupload.azurewebsites.net/api/settingsfields?';

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
        // console.log('External API response data:', data);
        
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Error occurred:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
