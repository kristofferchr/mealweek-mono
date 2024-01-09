

export interface JWT {
  Header: JWTHeader;
  Payload: JWTPayload;
  Signature: string;
  Raw: string;
}

export interface JWTPayload{
  sub: string;
  exp: string;
  email: string;
}

export interface JWTHeader{
  alg: string;
  typ: string;
}

export const ParseJwt = (jwtString: string): JWT => {
  const [headerbase64, payloadBase64, signature] = jwtString.split(".")

  const headerString = atob(headerbase64)
  const payloadString = atob(payloadBase64)

  const jwt: JWT = {
    Header: JSON.parse(headerString),
    Payload: JSON.parse(payloadString),
    Signature: signature,
    Raw: jwtString
  }

  return jwt
}
