export interface JwtPayload {
  sub: number;
  providerId: string;
  email?: string | null;
}
