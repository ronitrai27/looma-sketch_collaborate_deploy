import { GetFileResponse } from '@figma/rest-api-spec';

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: any[];
  strokes?: any[];
  backgroundColor?: { r: number; g: number; b: number; a: number };
  cornerRadius?: number;
}

export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: FigmaNode;
}