import { GetFileResponse } from '@figma/rest-api-spec';

export class FigmaProcessor {
  /**
   * Extract useful information from Figma file data
   */
  static processFileData(fileData: GetFileResponse) {
    return {
      name: fileData.name,
      lastModified: fileData.lastModified,
      version: fileData.version,
      thumbnailUrl: fileData.thumbnailUrl,
      document: this.processNode(fileData.document),
      pages: fileData.document.children?.map(child => ({
        id: child.id,
        name: child.name,
        type: child.type,
      })) || [],
    };
  }

  /**
   * Process a Figma node recursively
   */
  private static processNode(node: any): any {
    return {
      id: node.id,
      name: node.name,
      type: node.type,
      bounds: node.absoluteBoundingBox,
      backgroundColor: node.backgroundColor,
      fills: node.fills,
      strokes: node.strokes,
      cornerRadius: node.cornerRadius,
      children: node.children?.map((child: any) => this.processNode(child)),
    };
  }

  /**
   * Extract frames from Figma file for canvas import
   */
  static extractFrames(fileData: GetFileResponse) {
    const frames: any[] = [];
    
    const traverse = (node: any) => {
      if (node.type === 'FRAME' || node.type === 'COMPONENT') {
        frames.push({
          id: node.id,
          name: node.name,
          type: node.type,
          bounds: node.absoluteBoundingBox,
          backgroundColor: node.backgroundColor,
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    fileData.document.children?.forEach(traverse);
    return frames;
  }

  /**
   * Convert Figma color to hex
   */
  static colorToHex(color: { r: number; g: number; b: number; a?: number }): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}
