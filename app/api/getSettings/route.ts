async function GET(request, response) {
    // const url = new URL(request.url, `http://${request.headers.host}`);
    // const field = url.searchParams.get('field') || 'header';
    
    const apiURL = `https://functionappupload.azurewebsites.net/api/settingsfields?field=header`;

    try {
        console.log('Fetching data from:', apiURL);

        const apiResponse = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("Error response from external API:", errorText);
            return response.status(apiResponse.status).json({ error: errorText });
        }

        const data = await apiResponse.json();
        return response.status(200).json(data);
    } catch (err) {
        console.error("Error occurred:", err);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}