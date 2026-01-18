import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.FIGMA_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/figma/callback`;
  const state = Math.random().toString(36).substring(7); 
  
  // Scope: file_content:read is the recommended scope for reading file contents
  const url = `https://www.figma.com/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=file_content:read&state=${state}&response_type=code`;
  
  return NextResponse.json({ url });
}
