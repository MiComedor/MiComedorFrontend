export default interface Note {
  idNote?: number;
  noteText: string;
  users?: { idUser: number };
}