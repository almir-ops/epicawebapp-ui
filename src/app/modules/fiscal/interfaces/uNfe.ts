export interface uNfe{
  //codigo:Number;
  cod_serv_atividade:Number;
  valor_nfe:Number;
  descricao_servico:String;
  aliquota: Number;
  codigo_cliente?: Number | undefined | null;
  nomeCliente:String ;
  razao_social:String ;
  tipo_pessoa:String ;
  logradouro:String ;
  numero:String ;
  bairro:String ;
  cep:String ;
  telefone:String ;
  email:String ;
  celular:String ;
  complemento:String;
  cpf_cnpj:String ;
  codigo_cidade:String ;
  uf:String;
}
