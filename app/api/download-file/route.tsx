import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        // console.log("Request Body:", requestBody);
        const req  = requestBody;
        const content = req.content;
        console.log('request content is ........\n',req);
        const apiURL = 'https://functionappupload.azurewebsites.net/api/downloadmodification?';

        const apiResponse = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("Error response from external API:", errorText);
            return new NextResponse("You encountered an error: " + errorText, { status: apiResponse.status });
        }

        const data = await apiResponse.json();
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error("Error occurred:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
