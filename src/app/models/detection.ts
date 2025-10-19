export interface DetectionItem {
  id: number;
  data: string;     
  url_image: string;
  lat: number;
  long: number;
  tipo: string[];   
}

export interface DetectionResponse {
  data: DetectionItem[];
}
