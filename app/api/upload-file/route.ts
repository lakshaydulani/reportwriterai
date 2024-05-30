import fetch from 'node-fetch';

export const runtime = "edge";

export async function POST(req) {
  const { base64File } = await req.json();  // Changed to parse the JSON body correctly
  
  if (!base64File) {
    return new Response(JSON.stringify({ error: 'File is required' }), { status: 400 });
  }

  const apiUrl = 'https://functionappupload.azurewebsites.net/api/function?';

  try {
    console.log('Sending request to external API...');
    const response = await fetch(apiUrl, {
      method: 'POST',  // Added method: 'POST'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file: base64File })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from external API:', errorText);
      return new Response(JSON.stringify({ error: errorText }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}
