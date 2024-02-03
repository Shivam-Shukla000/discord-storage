import axios from "axios";
import { useState } from "react";
export default function Upload() {
  const [file, setFile] = useState();
  function handleChange(e) {
    setFile(e.target.files[0]);
  }
  async function handleSubmit() {
    if (!file) {
      console.log("no file");
      return;
    }
    const formData = new FormData();
    console.log(file);
    formData.append("test", " true");
    formData.append("file", file);
    formData.append("fileName", file.name);

    const response = await axios.post(
      "http://localhost:5002/upload",
      formData,
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    );
    console.log(response);
  }
  return (
    <>
      <div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleSubmit}>submit file</button>
      </div>
    </>
  );
}
