import { FillModel } from "./fill_model";

export interface FillStore {

  storeFills(fillModel: FillModel): Promise<void>

  getFills(): FillModel | Promise<FillModel | undefined> | undefined

  clearFills(): void

}

export class ClientStorageFillStore implements FillStore {

  private static FILL_KEY = 'com.aashreys.darkenpages.clientstorage.fillmodel'

  storeFills(fillModel: FillModel): Promise<void> {
    return figma.clientStorage.setAsync(ClientStorageFillStore.FILL_KEY, fillModel)
  } 

  getFills(): Promise<FillModel | undefined> {
    return figma.clientStorage.getAsync(ClientStorageFillStore.FILL_KEY)
  }

  clearFills(): void {
    figma.clientStorage.setAsync(ClientStorageFillStore.FILL_KEY, undefined)
  }

}