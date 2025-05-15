import api from "../axiosInstance";
import Note from "../types/note.type";

const API_URL = "/note";

class NoteService {
  insertarNota = async (note: Partial<Note>): Promise<Note> => {
    console.log("Llamando al backend con:", note);
    const response = await api.post<Note>(API_URL, note);
    return response.data;
  };
  listarNota = async (): Promise<Note[]> => {
    const response = await api.get<Note[]>(API_URL);
    return response.data;
  };

  actualizarNote = async (note: Note): Promise<Note> => {
    const response = await api.put<Note>(`${API_URL}/${note.idNote}`, note);
    return response.data;
  };

  eliminarNota = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`);
  };
}

export default new NoteService();
