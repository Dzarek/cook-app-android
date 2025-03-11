"use client";

import { MdOutlineClose } from "react-icons/md";
import { useGlobalContext } from "./authContext";
import { deleteData, uploadData } from "@/lib/admin.actions";

interface ImportModalProps {
  setOpenImportModal: (open: boolean) => void;
}

const ImportModal = ({ setOpenImportModal }: ImportModalProps) => {
  const { file, setFile } = useGlobalContext();

  const readJsonFile = (file: any) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        if (e.target) {
          resolve(JSON.parse(e.target.result));
        }
      };
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const parsedData = await readJsonFile(e.target.files[0]);
      setFile(parsedData);
    }
  };

  const handleSubmitImport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      deleteData(file);
      uploadData(file);
      setOpenImportModal(false);
    }
  };

  return (
    <div className="importModal">
      <div className="bigContainer" data-aos="zoom-in">
        <MdOutlineClose
          onClick={() => setOpenImportModal(false)}
          className="closeBtn"
        />
        <h3>Import bazy danych</h3>
        <form onSubmit={(e) => handleSubmitImport(e)}>
          <label htmlFor="upload">
            Wybierz plik z kopią zapasową w formacie JSON.
          </label>
          <input
            type="file"
            id="upload"
            name="upload"
            onChange={(e) => handleChangeFile(e)}
            required
            accept=".json,application/json"
          />
          <button type="submit">Potwierdź</button>
        </form>
        <p>
          UWAGA !!! <br /> Potwierdzając import nowej bazy danych, aktualne
          listy transferów zostaną zastąpione nowymi!
        </p>
      </div>
    </div>
  );
};

export default ImportModal;
