export interface FuncionarioCreatePayload {
  usuario_id: number;
  cargo: string;
  departamento: string;
  data_admissao: string;
  data_demissao?: string | null;
  nif: string;
  turno: string;
  anos_experiencia?: number | null;
}
