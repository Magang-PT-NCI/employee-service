export type LoginRequest = {
  body: {
    nik: string;
    password: string;
  };
};

export type TokenValidationRequest = {
  body: {
    token: string;
  };
};
