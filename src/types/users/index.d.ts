type TRole = 'admin'|'super_admin'

type TUserDetails = {
  created_at: string;
  email: string;
  firstname: string;
  id: number;
  lastname: string;
  roles: TRole[];
  uid: string;
};

type TUsersResponse = {
  data: TUserDetails[]
  meta?: { total?: number }
}

type TCreateUserPayload = {
    "firstname": string
    "lastname": string
    "email": string
    "password": string
    "password_confirmation": string
    "role": TRole
}

type TGetUserResponse = {
  data: TUserDetails;
};

type TEditUserPayload = {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  uid: string
};