export default interface Note {
  idNote?: number; // opcional porque no lo necesitas al crear
  noteText: string;
  users?: {
    idUser: number;
  };
}