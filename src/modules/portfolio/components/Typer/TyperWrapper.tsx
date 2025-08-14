import React from "react";

interface TypedWrapperProps {
  fontSizeCursor?: string;
  children: React.ReactNode;
}

export const TypedWrapper: React.FC<TypedWrapperProps> = ({
  fontSizeCursor = "1rem",
  children,
}) => (
  <div className="flex items-end">
    {React.Children.map(children, (child) =>
      React.isValidElement(child) &&
      child.props &&
      typeof child.props === "object" &&
      "className" in child.props &&
      "style" in child.props &&
      typeof child.props.className === "string" &&
      child.props.className.includes("typed-cursor")
        ? React.cloneElement(
            child as React.ReactElement<{ style: React.CSSProperties }>,
            {
              style: {
                fontSize: fontSizeCursor,
                marginBottom: `calc(${fontSizeCursor} * -0.05)`,
                ...(child.props.style || {}),
              },
            }
          )
        : child
    )}
  </div>
);
