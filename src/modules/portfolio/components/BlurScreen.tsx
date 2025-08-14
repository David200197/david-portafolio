import className from "./BlurScreen.module.css";

type Props = { height?: string };
export const BlurScreen = ({ height = "100%" }: Props) => (
  <div className={className.blur_screen} style={{ height }} />
);
