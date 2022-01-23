import axios, { AxiosInstance } from 'axios';
import { RequestErrorHandler } from '@cig-platform/decorators';
import {
  IAdvertising,
  IBreeder,
  IBreederContact,
  IPoultry,
  IPoultryImage,
  IPoultryRegister,
} from '@cig-platform/types';

interface RequestSuccess {
  ok: true;
}

export interface GetBreedersSuccess extends RequestSuccess {
  breeders: IBreeder[];
}

export interface GetBreederSuccess extends RequestSuccess {
  breeder: IBreeder & { contacts: IBreederContact[] };
  poultries: IPoultry[];
}

export interface GetPoultrySuccess extends RequestSuccess {
  poultry: IPoultry & { images: IPoultryImage[]; code: string; };
  registers: IPoultryRegister[];
  advertisings: IAdvertising[];
  vaccines: IPoultryRegister[];
  measurementAndWeigthing: IPoultryRegister[];
  whatsAppContacts: IBreederContact[];
}

export default class ContentSearchClient {
  private _axiosBackofficeBffInstance: AxiosInstance;

  constructor(contentSearchUrl: string) {
    this._axiosBackofficeBffInstance = axios.create({
      baseURL: contentSearchUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
      }
    });
  }

  @RequestErrorHandler([])
  async getBreeders(keyword = '') {
    const { data } = await this._axiosBackofficeBffInstance.get<GetBreedersSuccess>(
      `/v1/breeders?keyword=${keyword}`, 
    );

    return data;
  }

  @RequestErrorHandler()
  async getBreeder(breederId = '') {
    const { data } = await this._axiosBackofficeBffInstance.get<GetBreederSuccess>(`/v1/breeders/${breederId}`);

    return data;
  }

  @RequestErrorHandler()
  async getPoultry(breederId = '', poultryId = '') {
    const { data } = await this._axiosBackofficeBffInstance.get<GetPoultrySuccess>(
      `/v1/breeders/${breederId}/poultries/${poultryId}`
    );

    return data;
  }
}
