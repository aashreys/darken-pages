import { convertHexColorToRgbColor, emit, on, showUI } from "@create-figma-plugin/utilities"
import { Events } from "./events"
import { Fill, FillModel } from "./fill_model"
import { ClientStorageFillStore } from "./fill_store"

const DEFAULT_FILLS: FillModel = {
  darkFill: { hex: '222222', opacity: 100 },
  lightFill: { hex: 'F5F5F5', opacity: 100 }
}

const fillStore = new ClientStorageFillStore()

let fills: FillModel

export function darkenAllPages() {
  initializePlugin().then(() => {
    changeAllPageColors(fills.darkFill)
    figma.closePlugin('🎉')
  }) 
}

export function lightenAllPages() {
  initializePlugin().then(() => {
    changeAllPageColors(fills.lightFill)
    figma.closePlugin('🎉')
  })
}

export function darkenCurrentPage() {
  initializePlugin().then(() => {
    changeCurrentPageColor(fills.darkFill)
    figma.closePlugin('🎉')
  })
}

export function lightenCurrentPage() {
  initializePlugin().then(() => {
    changeCurrentPageColor(fills.lightFill)
    figma.closePlugin('🎉')
  })
}

export function adjustColors() {
  initializePlugin().then(() => {
    const options = { 
      title: 'Adjust Colors...',
      width: 240,
      height: 160
    }
    const data = {
      userFills: fills,
      defaultFills: DEFAULT_FILLS
    }
    showUI(options, data)
  })
}

async function initializePlugin() {
  // Set up event listeners
  on(Events.ON_FILLS_CHANGED, onFillsChanged)
  on(Events.ON_FILLS_RESET, onFillsReset)

  // Set up fills
  let tempFills = await fillStore.getFills()
  fills = tempFills ? tempFills : DEFAULT_FILLS
}

function changeCurrentPageColor(fill: Fill) {
  figma.currentPage.backgrounds = [createBackgroundPaint(fill)]
}

function changeAllPageColors(fill: Fill) {
  let backgroundPaint: Paint = createBackgroundPaint(fill)
  let pages: ReadonlyArray<PageNode> = figma.root.children
  for (let page of pages) {
    page.backgrounds = [backgroundPaint]
  }
}

function createBackgroundPaint(fill: Fill): Paint {
  return {
    type: 'SOLID',
    color: convertHexColorToRgbColor(fill.hex) as RGB,
    opacity: fill.opacity / 100
  }
}

function onFillsChanged(fills: FillModel) {
  fillStore.storeFills(fills)
}

function onFillsReset() {
  fillStore.clearFills()
}