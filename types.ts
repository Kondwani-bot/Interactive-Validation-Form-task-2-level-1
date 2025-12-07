export interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}
