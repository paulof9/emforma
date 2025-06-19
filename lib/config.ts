export const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const jwtSecretProcessEnv = process.env.JWT_SECRET;

if (!jwtSecretProcessEnv) {
    console.error("ERRO FATAL: A variável de ambiente para o segredo JWT não está definida.");
    process.exit(1);
}
export const MAX_AGE_COOKIE = 60 * 60 * 24 * 30; // 30 dias

export const JWT_SECRET: string = jwtSecretProcessEnv;
