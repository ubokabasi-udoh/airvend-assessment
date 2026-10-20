type TLoginPayload = {
  email: string;
  password: string;
};

type TLoginResponse = {
  token: string;
  user: {
    id: number;
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    roles: ["super_admin"];
    client: null;
    created_at: Date;
  };
  roles: ["super_admin"];
};
