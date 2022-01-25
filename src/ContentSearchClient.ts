import axios, { AxiosInstance } from 'axios';
import { RequestErrorHandler } from '@cig-platform/decorators';
import {
  IAdvertising,
  IAdvertisingQuestion,
  IAdvertisingQuestionAnswer,
  IBreeder,
  IBreederContact,
  IPoultry,
  IPoultryImage,
  IPoultryRegister,
  IUser,
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

interface PoultryWithImages extends IPoultry {
  images: IPoultryImage[];
  mainImage: string;
}

export interface GetBreederPoultriesSuccess extends RequestSuccess {
  forSale: PoultryWithImages[];
  reproductives: PoultryWithImages[];
  matrixes: PoultryWithImages[];
  males: PoultryWithImages[];
  females: PoultryWithImages[];
}

type AdvertisingQuestionAnswer = IAdvertisingQuestionAnswer & {
  user: IUser;
}

type Question = IAdvertisingQuestion & {
  answers: AdvertisingQuestionAnswer[];
  user: IUser;
}

type Advertising = IAdvertising & {
  questions: Question[];
}

export interface GetPoultrySuccess extends RequestSuccess {
  poultry: IPoultry & { images: IPoultryImage[]; code: string; };
  registers: IPoultryRegister[];
  advertisings: Advertising[];
  vaccines: IPoultryRegister[];
  measurementAndWeigthing: IPoultryRegister[];
  whatsAppContacts: IBreederContact[];
  breeder: IBreeder;
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
  async getBreederPoultries(breederId = '') {
    const { data } = await this._axiosBackofficeBffInstance.get<GetBreederPoultriesSuccess>(
      `/v1/breeders/${breederId}/poultries`
    );

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
