import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('📍 Figma OAuth callback hit');
  
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('❌ OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?error=${error}`
    );
  }

  if (!code) {
    console.error('❌ No code received from Figma');
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?error=no_code`
    );
  }

  console.log('✅ Received OAuth code:', code.substring(0, 10) + '...');

  try {
    // Exchange code for access token
    console.log('🔄 Exchanging code for access token...');
    
    const tokenResponse = await fetch('https://api.figma.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.FIGMA_CLIENT_ID!,
        client_secret: process.env.FIGMA_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/figma/callback`,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token exchange failed:', errorText);
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Access token received:', tokenData.access_token.substring(0, 10) + '...');

    // Store token in a cookie or session (simplified version)
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?figma_connected=true`
    );
    
    // Set token in httpOnly cookie for security
    response.cookies.set('figma_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in || 7200, // 2 hours default
      path: '/',
    });

    console.log('✅ Redirecting back to app with token');
    return response;

  } catch (error) {
    console.error('❌ Error in OAuth callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?error=token_exchange_failed`
    );
  }
}