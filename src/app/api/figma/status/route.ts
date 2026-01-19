import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('figma_access_token');
  return NextResponse.json({ isConnected: !!accessToken });
}
