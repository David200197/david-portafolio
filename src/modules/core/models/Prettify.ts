// Force type expansion so they are displayed flat and readable in the editor.
export type Prettify<T> = { 
  [K in keyof T]: T[K] 
} & {};