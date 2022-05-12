import { convertHexColorToRgbColor } from "@create-figma-plugin/utilities"

export function darkenPages() {
  changeAllPageColors('222222')
  figma.closePlugin('🎉')
}

export function lightenPages() {
  changeAllPageColors('eaeaea')
  figma.closePlugin('🎉')
}

function changeAllPageColors(hexColor: string) {
  let backgroundPaint: Paint = {
    type: 'SOLID',
    color: convertHexColorToRgbColor(hexColor) as RGB
  }
  let pages: ReadonlyArray<PageNode> = figma.root.children
  for (let page of pages) {
    page.backgrounds = [backgroundPaint]
  }
}