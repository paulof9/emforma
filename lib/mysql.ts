import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,

};

let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig);
      console.log('MySQL Pool criado com sucesso.');

      pool.getConnection()
        .then(connection => {
          console.log('Conexão de teste com MySQL bem-sucedida!');
          connection.release();
        })
        .catch(err => {
          console.error('Falha ao testar conexão com MySQL Pool:', err);
          pool = null;
        });

    } catch (error) {
      console.error('Erro ao criar MySQL Pool:', error);
      throw error;
    }
  }
  return pool;
}

export async function queryDatabase(sql: string, params?: any[]): Promise<any> {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error("MySQL Pool não está disponível.");
  }

  let connection;
  try {
    connection = await currentPool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erro na query ao banco de dados:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}