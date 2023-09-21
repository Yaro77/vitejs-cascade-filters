export interface User {
  address: {
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
    state: string;
    street_address: string;
    street_name: string;
    zip_code: string;
  };
  avatar: string;
  credit_card: {
    cc_number: string;
  };
  date_of_birth: string;
  email: string;
  employment: {
    title: string;
    key_skill: string;
  };
  first_name: string;
  gender: string;
  id: number;
  last_name: string;
  password: string;
  phone_number: string;
  social_insurance_number: string;
  subscription: {
    payment_method: string;
    plan: string;
    status: string;
    term: string;
  };
  uid: string;
  username: string;
}

export const GENDER_FILTER = Symbol('GENDER_FILTER');

export const SUBSCRIPTION_PLAN_FILTER = Symbol('SUBSCRIPTION_PLAN');

export const SUBSCRIPTION_STATUS_FILTER = Symbol('SUBSCRIPTION_STATUS');
