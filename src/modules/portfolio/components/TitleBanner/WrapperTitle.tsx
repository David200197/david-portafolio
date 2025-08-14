type Props = { children?: React.ReactNode };

export const WrapperTitle = ({ children }: Props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "absolute",
      top: "50vh",
      transform: "translate(-50%, -50%)",
      left: "50%",
      zIndex: 3,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
