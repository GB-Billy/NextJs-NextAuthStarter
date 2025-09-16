import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, systemInstructions } = body;

    // TODO: Replace this with a call to a real AI service (e.g., OpenAI, Gemini)
    console.log('System Instructions:', systemInstructions);
    console.log('User Messages:', messages);

    // Simulate AI response
    const lastMessage = messages[messages.length - 1]?.text || '...';
    const aiResponse = `This is a simulated AI response to your message: "${lastMessage}". The system instructions were: "${systemInstructions}"`;

    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
