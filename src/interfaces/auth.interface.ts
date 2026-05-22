export interface ISignupUser {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}


export interface ILoginUser {
  email: string;
  password: string;
}