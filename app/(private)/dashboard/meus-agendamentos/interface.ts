export interface Agendamento {
  id: number;
  paciente: {
    id: number;
    usuario: {
      nome: string;
      sobrenome: string;
      email: string;
    };
  };
  doutor: {
    id: number;
    funcionario: {
      usuario: {
        nome: string;
        sobrenome: string;
        email: string;
      };
    };
    especialidade: string;
  };
  agendamento_tipo: "ONLINE" | "PRESENCIAL";
  data: string;
  hora_inicio: string;
  hora_fim: string;
  status: string;
  meeting_link: string | null;
}
