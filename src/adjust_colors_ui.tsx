import { render, Text, TextboxColor } from "@create-figma-plugin/ui"
import { h, JSX } from "preact"
import { FillModel } from "./fill_model"
import { useState } from 'preact/hooks'
import { emit } from "@create-figma-plugin/utilities"
import { Events } from "./events"

function createFillSettings() {
  return function (props: any) {

    let darkHexColor = props.fills.darkFill.hex
    let darkOpacity = props.fills.darkFill.opacity.toString() + '%'
    let lightHexColor = props.fills.lightFill.hex
    let lightOpacity = props.fills.lightFill.opacity.toString() + '%'
  
    function onDarkHexColorChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const darkHexColor = event.currentTarget.value
      saveFills(darkHexColor, darkOpacity, lightHexColor, lightOpacity)
    }
  
    function onDarkOpacityChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const darkOpacity = event.currentTarget.value
      saveFills(darkHexColor, darkOpacity, lightHexColor, lightOpacity)
    }
  
    function onLightHexColorChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const lightHexColor = event.currentTarget.value
      saveFills(darkHexColor, darkOpacity, lightHexColor, lightOpacity)
    }
  
    function onLightOpacityChange(event: JSX.TargetedEvent<HTMLInputElement>) {
      const lightOpacity = event.currentTarget.value
      saveFills(darkHexColor, darkOpacity, lightHexColor, lightOpacity)
    }
  
    function saveFills(darkHexColor: string, darkOpacity: string, lightHexColor: string, lightOpacity: string) {
      console.log(`Dark Fill: ${darkHexColor} : ${darkOpacity}`)
      console.log(`Light Fill: ${lightHexColor} : ${lightOpacity}`)
      if (darkOpacity.length === 0) darkOpacity = '0%'
      if (lightOpacity.length === 0) lightOpacity = '0%'
      let fills: FillModel = {
        darkFill: { hex: darkHexColor, opacity: parseInt(darkOpacity)},
        lightFill: { hex: lightHexColor, opacity: parseInt(lightOpacity)}
      }
      props.onFillsChanged(fills)
    }
  
    return (
      <div style="padding-left: 16px; padding-top: 12px; padding-bottom: 12px; padding-right: 8px">
  
      <div style="display: flex; align-items: center;">
  
        <Text style={'width: 35%'}>Dark Fill</Text>
  
        <TextboxColor
        hexColor={darkHexColor}
        hexColorPlaceholder={props.placeholderFills.darkFill.hex}
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
        hexColorPlaceholder={props.placeholderFills.lightFill.hex}
        opacity={lightOpacity}
        opacityPlaceholder="%"
        onHexColorInput={onLightHexColorChange}
        onOpacityInput={onLightOpacityChange}
        noBorder />
  
      </div>

      <Text 
      style={'margin-top: 12px'} 
      onClick={() => {props.onResetClicked()}}>
        <a href="#">Reset to default</a>
      </Text>
  
    </div>
    )
  }
}

export const GlobalFillSettings = createFillSettings()

function Plugin(props: any) {

  const [fills, setFills] = useState(props.userFills)

  function onFillsChanged(fills: FillModel) {
    setFills(fills)
    emit(Events.ON_FILLS_CHANGED, fills)
  }

  function onResetClicked() {
    console.log('On Reset Clicked')
    setFills(props.defaultFills)
    emit(Events.ON_FILLS_RESET)
  }

  return (
    <GlobalFillSettings
    fills={fills}
    placeholderFills={props.defaultFills}
    onFillsChanged={onFillsChanged}
    onResetClicked={onResetClicked} />
  )
  
}

export default render(Plugin)