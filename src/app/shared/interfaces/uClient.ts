export interface uClient{
  codigo: number;
  proposta: string;
  data_reg: string;
  falecimento: string;
  cliente: string;
  email: string;
  quadra: string;
  setor: string;
  lote: string;
  arquivos: [
    {
      codigo: number;
      arquivo_destino: string;
      path_destino: string;
      path_sys: string;
    }
  ]
}
