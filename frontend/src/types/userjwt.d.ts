import "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface UserJwtPayload {
    id?: number;
  }
}
