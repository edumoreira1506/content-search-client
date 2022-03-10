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
  pagination: {
    forSale: number;
    reproductives: number;
    matrixes: number;
    males: number;
    females: number;
  }
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

interface PoultryData {
  poultry: IPoultry & { mainImage: string; breederId: string };
  advertising: IAdvertising;
  breeder: IBreeder;
  measurementAndWeight: IPoultryRegister & {
    metadata: {
      weight?: string;
      measurement?: string;
    }
  };
}

export interface GetHomeSuccess extends RequestSuccess {
  femaleChickens: PoultryData[];
  maleChickens: PoultryData[];
  matrixes: PoultryData[];
  reproductives: PoultryData[];
}

export interface GetSearchSuccess extends RequestSuccess {
  advertisings: PoultryData[];
  pages: number;
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
  async getBreederPoultries(breederId = '', pagination: {
    forSale?: number;
    reproductives?: number;
    matrixes?: number;
    males?: number;
    females?: number;
  }) {
    const { data } = await this._axiosBackofficeBffInstance.get<GetBreederPoultriesSuccess>(
      `/v1/breeders/${breederId}/poultries`,
      {
        params: {
          pagination: JSON.stringify(pagination)
        }
      }
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

  @RequestErrorHandler()
  async getHome() {
    const { data } = await this._axiosBackofficeBffInstance.get<GetHomeSuccess>('/v1/home');

    return data;
  }

  @RequestErrorHandler()
  async getSearch({
    gender = [],
    type = [],
    tail = [],
    dewlap = [],
    crest = [],
    keyword,
    genderCategory = [],
    prices,
    sort,
    page = 0,
    favorites = []
  }: {
    gender?: string[];
    type?: string[];
    tail?: string[];
    dewlap?: string[];
    crest?: string[];
    keyword?: string;
    genderCategory?: string[];
    prices?: { min?: number; max?: number };
    sort?: string;
    favorites: string[];
    page?: number;
  }) {
    const { data } = await this._axiosBackofficeBffInstance.get<GetSearchSuccess>('/v1/search', {
      params: {
        gender: gender.filter(Boolean).length ? gender.filter(Boolean).join(',') : undefined,
        type: type.filter(Boolean).length ? type.filter(Boolean).join(',') : undefined,
        tail: tail.filter(Boolean).length ? tail.filter(Boolean).join(',') : undefined,
        dewlap: dewlap.filter(Boolean).length ? dewlap.filter(Boolean).join(',') : undefined,
        crest: crest.filter(Boolean).length ? crest.filter(Boolean).join(',') : undefined,
        keyword,
        genderCategory: genderCategory.filter(Boolean).length ? genderCategory.filter(Boolean).join(',') : undefined,
        prices: prices ? JSON.stringify(prices) : undefined,
        sort,
        favoriteIds: favorites.join(','),
        page
      }
    });

    return data;
  }
}
