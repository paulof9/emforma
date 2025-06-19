
export interface User {
    id: number;
    email: string;
    password_hash: string;
    nome?: string;
}

export interface JwtPayload {
    userId: number;
    email: string;
    name?: string;
    iat?: number;
    exp?: number;
}

export interface UserTokenPayload {
    userId: number;
}