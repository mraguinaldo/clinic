export interface DisponibilidadeMedico {
  id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  is_active: boolean;
  doutor: number;
  criado_aos: string;
}
