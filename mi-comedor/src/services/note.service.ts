import api from "../axiosInstance";
import Note from "../types/note.type";
import NoteByUserId from "../types/noteByUserId";

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

  actualizarNota = async (note: Note): Promise<Note> => {
    if (!note.idNote) {
      throw new Error("El campo 'idNote' es requerido para actualizar la nota.");
    }
    const response = await api.put<Note>(`${API_URL}/${note.idNote}`, note);
    return response.data;
  };

  eliminarNota = async (id: number | undefined): Promise<void> => {
    if (typeof id === "undefined") {
      throw new Error("El campo 'id' es requerido para eliminar la nota.");
    }
    await api.delete(`${API_URL}/${id}`);
  };

  buscarNotaPorUserId = async (id: number): Promise<NoteByUserId[]> => {
    const response = await api.get<NoteByUserId[]>(`${API_URL}/notaPorUsuario/${id}`);
    return response.data;
  };
}

export default new NoteService();
