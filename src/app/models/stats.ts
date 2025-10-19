export interface TipoContagem {
  [tipo: string]: number;
}

export interface ClusterStats {
  centro: [number, number];         
  total_pontos: number;
  por_tipo: TipoContagem;          
  datas: string[];                  
}



