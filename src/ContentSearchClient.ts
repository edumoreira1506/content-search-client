import axios, { AxiosInstance } from 'axios';
import { RequestErrorHandler } from '@cig-platform/decorators';
import { IBreeder, IBreederContact, IPoultry } from '@cig-platform/types';

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
}
