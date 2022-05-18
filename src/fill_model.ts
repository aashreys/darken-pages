export interface FillModel extends Record<string, unknown> {

  darkFill: Fill
  lightFill: Fill

}

export interface Fill {
  
  hex: string
  opacity: number

}