import { GetFileResponse } from '@figma/rest-api-spec';

interface TldrawShape {
  id: string;
  type: string;
  x: number;
  y: number;
  props: any;
}

export class FigmaToTldrawConverter {
  /**
   * Convert Figma file to Tldraw shapes
   */
  static convertToTldrawShapes(fileData: GetFileResponse): TldrawShape[] {
    const shapes: TldrawShape[] = [];
    
    // Process each page
    fileData.document.children?.forEach((page) => {
      if (page.children) {
        this.processNode(page, shapes, 0, 0);
      }
    });

    return shapes;
  }

  /**
   * Process a Figma node recursively and convert to Tldraw shapes
   */
  private static processNode(
    node: any,
    shapes: TldrawShape[],
    offsetX: number = 0,
    offsetY: number = 0
  ): void {
    const bounds = node.absoluteBoundingBox;
    if (!bounds) return;

    const x = bounds.x + offsetX;
    const y = bounds.y + offsetY;
    const width = bounds.width;
    const height = bounds.height;

    // Convert based on node type
    switch (node.type) {
      case 'FRAME':
      case 'COMPONENT':
      case 'INSTANCE':
        shapes.push({
          id: `shape:${node.id}`,
          type: 'geo',
          x,
          y,
          props: {
            w: width,
            h: height,
            geo: 'rectangle',
            color: this.getFillColor(node),
            fill: 'solid',
            dash: 'solid',
            size: 'm',
            opacity: node.opacity || 1,
          },
        });
        break;

      case 'RECTANGLE':
        shapes.push({
          id: `shape:${node.id}`,
          type: 'geo',
          x,
          y,
          props: {
            w: width,
            h: height,
            geo: 'rectangle',
            color: this.getFillColor(node),
            fill: this.getFillType(node),
            dash: this.getStrokeType(node),
            size: 'm',
            opacity: node.opacity || 1,
          },
        });
        break;

      case 'ELLIPSE':
        shapes.push({
          id: `shape:${node.id}`,
          type: 'geo',
          x,
          y,
          props: {
            w: width,
            h: height,
            geo: 'ellipse',
            color: this.getFillColor(node),
            fill: this.getFillType(node),
            dash: 'solid',
            size: 'm',
            opacity: node.opacity || 1,
          },
        });
        break;

      case 'TEXT':
        shapes.push({
          id: `shape:${node.id}`,
          type: 'text',
          x,
          y,
          props: {
            text: node.characters || '',
            size: this.getTextSize(node),
            color: this.getTextColor(node),
            w: width,
            h: height,
            autoSize: false,
            opacity: node.opacity || 1,
          },
        });
        break;

      case 'LINE':
        shapes.push({
          id: `shape:${node.id}`,
          type: 'line',
          x,
          y,
          props: {
            points: [
              { x: 0, y: 0 },
              { x: width, y: height },
            ],
            color: this.getStrokeColor(node),
            size: 'm',
            opacity: node.opacity || 1,
          },
        });
        break;
    }

    // Process children recursively
    if (node.children) {
      node.children.forEach((child: any) => {
        this.processNode(child, shapes, offsetX, offsetY);
      });
    }
  }

  /**
   * Get fill color from Figma node
   */
  private static getFillColor(node: any): string {
    if (!node.fills || node.fills.length === 0) return 'black';
    
    const fill = node.fills[0];
    if (fill.type === 'SOLID' && fill.color) {
      return this.figmaColorToTldraw(fill.color);
    }
    
    return 'black';
  }

  /**
   * Get fill type
   */
  private static getFillType(node: any): 'none' | 'semi' | 'solid' | 'pattern' {
    if (!node.fills || node.fills.length === 0) return 'none';
    
    const fill = node.fills[0];
    if (fill.opacity !== undefined && fill.opacity < 0.5) return 'semi';
    
    return 'solid';
  }

  /**
   * Get stroke color from Figma node
   */
  private static getStrokeColor(node: any): string {
    if (!node.strokes || node.strokes.length === 0) return 'black';
    
    const stroke = node.strokes[0];
    if (stroke.type === 'SOLID' && stroke.color) {
      return this.figmaColorToTldraw(stroke.color);
    }
    
    return 'black';
  }

  /**
   * Get stroke/dash type
   */
  private static getStrokeType(node: any): 'solid' | 'dashed' | 'dotted' | 'draw' {
    if (!node.strokes || node.strokes.length === 0) return 'solid';
    
    if (node.strokeDashes && node.strokeDashes.length > 0) {
      return 'dashed';
    }
    
    return 'solid';
  }

  /**
   * Get text color
   */
  private static getTextColor(node: any): string {
    if (!node.fills || node.fills.length === 0) return 'black';
    
    const fill = node.fills[0];
    if (fill.type === 'SOLID' && fill.color) {
      return this.figmaColorToTldraw(fill.color);
    }
    
    return 'black';
  }

  /**
   * Get text size
   */
  private static getTextSize(node: any): 's' | 'm' | 'l' | 'xl' {
    const fontSize = node.style?.fontSize || 16;
    
    if (fontSize < 14) return 's';
    if (fontSize < 20) return 'm';
    if (fontSize < 28) return 'l';
    return 'xl';
  }

  /**
   * Convert Figma color to Tldraw color
   */
  private static figmaColorToTldraw(color: { r: number; g: number; b: number; a?: number }): string {
    const { r, g, b } = color;
    
    // Map to closest Tldraw color
    if (r > 0.8 && g < 0.3 && b < 0.3) return 'red';
    if (r > 0.8 && g > 0.5 && b < 0.3) return 'orange';
    if (r > 0.8 && g > 0.8 && b < 0.3) return 'yellow';
    if (r < 0.3 && g > 0.6 && b < 0.3) return 'green';
    if (r < 0.3 && g > 0.6 && b > 0.8) return 'blue';
    if (r > 0.5 && g < 0.3 && b > 0.8) return 'violet';
    if (r < 0.3 && g < 0.3 && b < 0.3) return 'black';
    if (r > 0.7 && g > 0.7 && b > 0.7) return 'grey';
    
    return 'black';
  }

  /**
   * Get canvas bounds from file data
   */
  static getCanvasBounds(fileData: GetFileResponse): { minX: number; minY: number; maxX: number; maxY: number } {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const processNode = (node: any) => {
      if (node.absoluteBoundingBox) {
        const bounds = node.absoluteBoundingBox;
        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
      }
      if (node.children) {
        node.children.forEach(processNode);
      }
    };

    fileData.document.children?.forEach(processNode);

    return { minX, minY, maxX, maxY };
  }
}
