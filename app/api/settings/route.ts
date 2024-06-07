import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const req = await request.json();
        console.log('Request content is:', req);

        const apiURL = 'https://functionappupload.azurewebsites.net/api/settingsfields?';
        console.log('Sending request to external API:', apiURL);

        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        });

        console.log('External API response status:', apiResponse.status);

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
