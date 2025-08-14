import React from "react"
import moduleCss from "./ButtonContainer.module.css"

type Props = { children: React.ReactNode }

export const ButtonContainer = ({ children }: Props) => <div className={moduleCss.button_container} >{children}</div>
