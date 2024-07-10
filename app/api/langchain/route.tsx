import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const content = await request.json();

        const apiURL = 'https://langchaintest.azurewebsites.net/api/azureTest';

        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content),  // Convert content to JSON string
        });

        if (apiResponse.status !== 200) {
            const errorText = await apiResponse.text();
            console.error("Error response from external API:", errorText);
            return new NextResponse(`You encountered an error: ${errorText}`, { status: apiResponse.status });
        }

        const data = await apiResponse.text();

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Error occurred:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
