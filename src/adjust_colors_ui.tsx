import { render, Text, TextboxColor } from "@create-figma-plugin/ui"
import { h, JSX } from "preact"
import { FillModel } from "./fill_model"
import { useState } from 'preact/hooks'
import { emit } from "@create-figma-plugin/utilities"
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
      saveFills(newValue, darkOpacity, lightHexColor, lightOpacity)
    }
  
    function onDarkOpacityChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value
      setDarkOpacity(newValue)
      saveFills(darkHexColor, newValue, lightHexColor, lightOpacity)
    }
  
    function onLightHexColorChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value
      setLightHexColor(newValue)
      saveFills(darkHexColor, darkOpacity, newValue, lightOpacity)
    }
  
    function onLightOpacityChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value
      setLightOpacity(newValue)
      saveFills(darkHexColor, darkOpacity, lightHexColor, newValue)
    }
  
    function saveFills(darkHexColor: string, darkOpacity: string, lightHexColor: string, lightOpacity: string) {
      console.log(`Dark Fill: ${darkHexColor} : ${darkOpacity}`)
      console.log(`Light Fill: ${lightHexColor} : ${lightOpacity}`)

      if (darkOpacity.replace('%', '').length === 0) darkOpacity = '0%'
      if (lightOpacity.replace('%', '').length === 0) lightOpacity = '0%'
      let fills: FillModel = {
        darkFill: { hex: darkHexColor, opacity: parseInt(darkOpacity)},
        lightFill: { hex: lightHexColor, opacity: parseInt(lightOpacity)}
      }
      props.onFillsChanged(fills)
    }

    function onResetClicked() {
      setDarkHexColor(props.defaultFills.darkFill.hex)
      setDarkOpacity(props.defaultFills.darkFill.opacity + '%')
      setLightHexColor(props.defaultFills.lightFill.hex)
      setLightOpacity(props.defaultFills.lightFill.opacity + '%')
      props.onResetClicked()
    }
  
    return (
      <div style="padding-left: 16px; padding-top: 12px; padding-bottom: 12px; padding-right: 8px">
  
      <div style="display: flex; align-items: center;">
  
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
  
      <div style="display: flex; align-items: center; margin-top: 6px;">
  
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
      style={'margin-top: 16px; font-size: 12px'} 
      onClick={onResetClicked}>
        <a href="#">Reset to default</a>
      </Text>
  
    </div>
    )
  }
}

export const GlobalFillSettings = createFillSettings()

function Plugin(props: any) {

  function onFillsChanged(fills: FillModel) {
    emit(Events.ON_FILLS_CHANGED, fills)
  }

  function onResetClicked() {
    emit(Events.ON_FILLS_RESET)
  }

  return (
    <GlobalFillSettings
    fills={props.userFills}
    defaultFills={props.defaultFills}
    onFillsChanged={onFillsChanged}
    onResetClicked={onResetClicked} />
  )
  
}

export default render(Plugin)