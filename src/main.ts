import { convertHexColorToRgbColor } from "@create-figma-plugin/utilities"

let DARK_HEX = '222222'
let LIGHT_HEX = 'f5f5f5'

export function darkenAllPages() {
  changeAllPageColors(DARK_HEX)
  figma.closePlugin('🎉')
}

export function lightenAllPages() {
  changeAllPageColors(LIGHT_HEX)
  figma.closePlugin('🎉')
}

export function darkenCurrentPage() {
  changeCurrentPageColor(DARK_HEX)
  figma.closePlugin('🎉')
}

export function lightenCurrentPage() {
  changeCurrentPageColor(LIGHT_HEX)
  figma.closePlugin('🎉')
}

function changeCurrentPageColor(hexColor: string) {
  figma.currentPage.backgrounds = [createBackgroundPaint(hexColor)]
}

function changeAllPageColors(hexColor: string) {
  let backgroundPaint: Paint = createBackgroundPaint(hexColor)
  let pages: ReadonlyArray<PageNode> = figma.root.children
  for (let page of pages) {
    page.backgrounds = [backgroundPaint]
  }
}

function createBackgroundPaint(hexColor: string): Paint {
  return {
    type: 'SOLID',
    color: convertHexColorToRgbColor(hexColor) as RGB
  }
}