import { NextRequest, NextResponse } from 'next/server';
import { GetFileResponse } from '@figma/rest-api-spec';

export async function POST(request: NextRequest) {
  console.log('📍 Figma file fetch endpoint hit');

  try {
    const { fileUrl } = await request.json();
    console.log('📄 File URL received:', fileUrl);

    // Get access token from cookie
    const accessToken = request.cookies.get('figma_access_token')?.value;
    
    if (!accessToken) {
      console.error('❌ No access token found in cookies');
      return NextResponse.json(
        { error: 'Not authenticated. Please connect Figma first.' },
        { status: 401 }
      );
    }

    console.log('✅ Access token found:', accessToken.substring(0, 10) + '...');

    // Extract file key from URL
    // URL format: https://www.figma.com/file/ABC123/Project-Name
    // OR: https://www.figma.com/design/ABC123/Project-Name
    const fileKeyMatch = fileUrl.match(/\/(file|design)\/([a-zA-Z0-9]+)/);
    
    if (!fileKeyMatch) {
      console.error('❌ Invalid Figma URL format');
      return NextResponse.json(
        { error: 'Invalid Figma URL. Please use a valid file or design URL.' },
        { status: 400 }
      );
    }

    const fileKey = fileKeyMatch[2]; // Index 2 because we have two capture groups
    console.log('🔑 File key extracted:', fileKey);

    // Fetch file data from Figma API
    console.log('🔄 Fetching file from Figma API...');
    
    const fileResponse = await fetch(
      `https://api.figma.com/v1/files/${fileKey}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      console.error('❌ Figma API error:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch file: ${errorText}` },
        { status: fileResponse.status }
      );
    }

    const fileData: GetFileResponse = await fileResponse.json();
    console.log('✅ File data received:', fileData.name);
    console.log('📊 Document structure:', {
      childrenCount: fileData.document.children?.length,
      firstPage: fileData.document.children?.[0]?.name,
    });

    // Also fetch high-quality images for top-level frames
    console.log('🔄 Fetching high-quality images for frames...');
    
    const extractTopLevelFrames = (document: any): string[] => {
      const ids: string[] = [];
      if (!document.children) return ids;
      
      for (const page of document.children) {
        if (page.type === 'CANVAS' && page.children) {
          for (const child of page.children) {
            if (child.type === 'FRAME' || child.type === 'COMPONENT' || child.type === 'INSTANCE') {
              ids.push(child.id);
            }
          }
        }
      }
      return ids;
    };

    // Fetch first 15 frames at 2x scale for high quality
    const frameIds = extractTopLevelFrames(fileData.document).slice(0, 15);
    console.log(`🔍 Found ${frameIds.length} top-level frames to fetch images for`);

    let images = {};
    if (frameIds.length > 0) {
      try {
        const imageResponse = await fetch(
          `https://api.figma.com/v1/images/${fileKey}?ids=${frameIds.join(',')}&format=png&scale=2`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          images = imageData.images || {};
          console.log('✅ High-quality images fetched:', Object.keys(images).length);
        } else {
          console.warn('⚠️ Failed to fetch images:', await imageResponse.text());
        }
      } catch (error) {
        console.error('❌ Error fetching images:', error);
      }
    }

    return NextResponse.json({
      success: true,
      file: fileData,
      images: images,
    });

  } catch (error) {
    console.error('❌ Error fetching Figma file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file. Please try again.' },
      { status: 500 }
    );
  }
}