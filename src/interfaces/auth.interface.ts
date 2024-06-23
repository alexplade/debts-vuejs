export interface IUser {
  _id: string;
  username: string;
  firstName: string;
  lastName?: string;
}

export interface ISignUpUserDto {
  username: string;
  firstName: string;
  lastName?: string;
  password: string;
}
