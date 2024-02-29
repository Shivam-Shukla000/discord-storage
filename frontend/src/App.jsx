import Upload from "./Upload";
import axios from "axios";
// import Upload from "./Upload";
function App() {
  const clickfun = async () => {
    const data = await axios.get("http://localhost:5000/files/video");
    console.log(data);
  };
  return (
    <>
      <Upload />

      <button onClick={clickfun}></button>
    </>
  );
}

export default App;
