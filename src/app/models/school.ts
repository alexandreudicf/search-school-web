import { NumberValueAccessor } from "@angular/forms";

export class School {
  nome?: string;
  codigo?: number;
  abrNome?: string;
  bairro?: string;
  cep?: string;
  telefone?: string;
  latitude!: number;
  longitude!: number;
}
