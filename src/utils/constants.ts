import { TCategoryMapping } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export const categoryMapping: TCategoryMapping = {
    другое: 'card__category_other',
    'софт-скил': 'card__category_soft',
    дополнительное: 'card__category_additional',
    кнопка: 'card__category_button',
    'хард-скил': 'card__category_hard',
  };

export const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
export const TEL_REGEXP = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;