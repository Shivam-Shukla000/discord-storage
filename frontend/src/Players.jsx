import ReactPlayer from "react-player";
export default function Players(props) {
  return (
    <>
      <ReactPlayer controls url={props.url}></ReactPlayer>
    </>
  );
}
