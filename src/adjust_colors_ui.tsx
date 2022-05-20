import { render, Text, TextboxColor } from "@create-figma-plugin/ui"
import { h, JSX } from "preact"
import { Fill, FillModel } from "./fill_model"
import { useState } from 'preact/hooks'
import { emit, ensureMinimumTime } from "@create-figma-plugin/utilities"
import { Events } from "./events"

function createFillSettings() {
  return function (props: any) {

    const [darkHexColor, setDarkHexColor] = useState(props.fills.darkFill.hex)
    const [darkOpacity, setDarkOpacity] = useState(props.fills.darkFill.opacity + '%')
    const [lightHexColor, setLightHexColor] = useState(props.fills.lightFill.hex)
    const [lightOpacity, setLightOpacity] = useState(props.fills.lightFill.opacity + '%')
  
    function onDarkHexColorChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value
      setDarkHexColor(newValue)
      previewFill(newValue, darkOpacity)
    }
  
    function onDarkOpacityChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value
      setDarkOpacity(newValue)
      previewFill(darkHexColor, newValue)
    }
  
    function onLightHexColorChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value
      setLightHexColor(newValue)
      previewFill(newValue, lightOpacity)
    }
  
    function onLightOpacityChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value
      setLightOpacity(newValue)
      previewFill(lightHexColor, newValue)
    }

    function opacityStringToNumber(opacity: string): number {
      if (opacity.replace('%', '').length === 0) opacity = '0%'
      return parseInt(opacity)
    }

    function onResetClicked() {
      setDarkHexColor(props.defaultFills.darkFill.hex)
      setDarkOpacity(props.defaultFills.darkFill.opacity + '%')
      setLightHexColor(props.defaultFills.lightFill.hex)
      setLightOpacity(props.defaultFills.lightFill.opacity + '%')
      props.onFillsReset()
    }

    function onFocusCapture() {
      
    }

    function onBlurCapture() {
      let fills: FillModel = {
        darkFill: { hex: darkHexColor, opacity: opacityStringToNumber(darkOpacity)},
        lightFill: { hex: lightHexColor, opacity: opacityStringToNumber(lightOpacity)}
      }
      props.onFillsSet(fills)
    }

    function previewFill(hex: string, opacity: string) {
      props.onFillPreview({
        hex: hex,
        opacity: opacityStringToNumber(opacity)
      })
    }
  
    return (
      <div style="padding-left: 16px; padding-top: 12px; padding-bottom: 12px; padding-right: 8px">
  
      <div style="display: flex; align-items: center;" 
      onFocusCapture={onFocusCapture} 
      onBlurCapture={onBlurCapture}>
  
        <Text style={'width: 35%'}>Dark Fill</Text>
  
        <TextboxColor
        hexColor={darkHexColor}
        hexColorPlaceholder={props.defaultFills.darkFill.hex}
        opacity={darkOpacity}
        opacityPlaceholder="%"
        onHexColorInput={onDarkHexColorChange}
        onOpacityInput={onDarkOpacityChange}
        noBorder />
  
      </div>
  
      <div style="display: flex; align-items: center; margin-top: 6px;" 
      onFocusCapture={onFocusCapture} 
      onBlurCapture={onBlurCapture}>
  
        <Text style={'width: 35%'}>Light Fill</Text>
  
        <TextboxColor
        hexColor={lightHexColor}
        hexColorPlaceholder={props.defaultFills.lightFill.hex}
        opacity={lightOpacity}
        opacityPlaceholder="%"
        onHexColorInput={onLightHexColorChange}
        onOpacityInput={onLightOpacityChange}
        noBorder />
  
      </div>

      <Text 
      style={'margin-top: 16px'} 
      onClick={onResetClicked}>
        <a href="#">Reset to default</a>
      </Text>
  
    </div>
    )
  }
}

export const GlobalFillSettings = createFillSettings()

function Plugin(props: any) {

  function onFillPreview(fill: Fill) {
    emit(Events.ON_FILL_PREVIEW, fill)
  }

  function onFillsSet(fills: FillModel) {
    emit(Events.ON_FILLS_SET, fills)
  }

  function onFillsReset() {
    emit(Events.ON_FILLS_RESET)
  }

  return (
    <GlobalFillSettings
    fills={props.userFills}
    defaultFills={props.defaultFills}
    onFillPreview={onFillPreview}
    onFillsSet={onFillsSet}
    onFillsReset={onFillsReset} />
  )
  
}

export default render(Plugin)