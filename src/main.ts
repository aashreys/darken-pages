import { convertHexColorToRgbColor, isValidHexColor, on, setRelaunchButton, showUI, unsetRelaunchButton } from "@create-figma-plugin/utilities"
import { Events } from "./events"
import { Fill, FillModel } from "./fill_model"
import { ClientStorageFillStore } from "./fill_store"

const DEFAULT_FILLS: FillModel = {
  darkFill: { hex: '1E1E1E', opacity: 100 },
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
    startEventListeners()
    const options = { 
      title: 'Adjust Colors...',
      width: 240,
      height: 120
    }
    const data = {
      userFills: fills,
      defaultFills: DEFAULT_FILLS
    }
    showUI(options, data)
  })
}

async function initializePlugin() {
  await initializeFills()
}

async function initializeFills() {
  let tempFills = await fillStore.getFills()
  fills = tempFills ? tempFills : DEFAULT_FILLS
}

function startEventListeners() {
  on(Events.ON_FILLS_SET, onFillsSet)
  on(Events.ON_FILLS_RESET, onFillsReset)
  on(Events.ON_FILL_PREVIEW, onFillPreview)
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

function onFillsSet(fills: FillModel) {
  fillStore.storeFills(fills)
  figma.notify('🎉')
}

function onFillsReset() {
  fillStore.clearFills()
  changeCurrentPageColor(DEFAULT_FILLS.lightFill)
}

function onFillPreview(fill: Fill) {
  if (isValidHexColor(fill.hex)) {
    changeCurrentPageColor(fill)
  }
}