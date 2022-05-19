import { convertHexColorToRgbColor, isValidHexColor, on, setRelaunchButton, showUI } from "@create-figma-plugin/utilities"
import { Events } from "./events"
import { Fill, FillModel } from "./fill_model"
import { ClientStorageFillStore } from "./fill_store"

const DEFAULT_FILLS: FillModel = {
  darkFill: { hex: '222222', opacity: 100 },
  lightFill: { hex: 'F5F5F5', opacity: 100 }
}

const fillStore = new ClientStorageFillStore()

let fills: FillModel

export function darkenPages() {
  initializePlugin().then(() => {
    changeAllPageColors(fills.darkFill)
    figma.closePlugin('🎉')
  }) 
}

export function lightenPages() {
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
  setRelaunchButtons()
  await initializeFills()
}

function setRelaunchButtons() {
  if (!('darkenPages' in figma.root.getRelaunchData())) setRelaunchButton(figma.root, 'darkenPages')
  if (!('lightenPages' in figma.root.getRelaunchData())) setRelaunchButton(figma.root, 'lightenPages')
}

async function initializeFills() {
  let tempFills = await fillStore.getFills()
  fills = tempFills ? tempFills : DEFAULT_FILLS
}

function startEventListeners() {
  on(Events.ON_FILLS_CHANGED, onFillsChanged)
  on(Events.ON_FILLS_RESET, onFillsReset)
  on(Events.ON_PREVIEW_START, onPreviewStart)
  on(Events.ON_PREVIEW_UPDATE, onPreviewUpdate)
  on(Events.ON_PREVIEW_END, onPreviewEnd)
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

function onPreviewStart() {
}

function onPreviewUpdate(fill: Fill) {
  if (isValidHexColor(fill.hex)) {
    changeCurrentPageColor(fill)
  }
}

function onPreviewEnd() {
  figma.notify('Page color saved 🎉', {timeout: 1500})
}