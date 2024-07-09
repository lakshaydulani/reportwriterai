import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const content = await request.json(); // Directly get the content array
        console.log('Request content is:', content);

        const apiURL = 'https://langchaintest.azurewebsites.net/api/azureTest';

        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content),  // Convert content to JSON string
        }); 
        console.log(apiResponse.status);

        if (apiResponse.status !== 200) {
            const errorText = await apiResponse.text();
            console.error("Error response from external API:", errorText);
            return new NextResponse(`You encountered an error: ${errorText}`, { status: apiResponse.status });
        }

        const data = await apiResponse.text();
        console.log("data from API route is :\n", data);

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Error occurred:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
