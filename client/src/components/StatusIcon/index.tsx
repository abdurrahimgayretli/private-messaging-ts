import "./styles.sass";
interface IMyProps {
  connected: Boolean;
}
export default function StatusIcon(props: IMyProps) {
  return <i className={"icon" + (props.connected ? " connected" : "")}></i>;
}
