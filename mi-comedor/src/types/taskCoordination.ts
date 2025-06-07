export default interface TaskCoordination {
  idTaskCoordination?: number;
  fullname: string;
  dateTask: string; 
  timeTask: string;   
  users?: {
    idUser: number;
  };
  typeOfTask?: {
    idTypeOfTask: number;
  };
}
