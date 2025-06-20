import mysql, { Pool, RowDataPacket } from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true, 
  connectionLimit: 10,      
  queueLimit: 0,
  dateStrings: true,
};

export interface OkPacket {
  affectedRows: number;
  insertId: number;
  changedRows: number;
}

export async function executeActionQuery(sql: string, params: any[] = []): Promise<OkPacket> {
  let connection;
  try {
    connection = await pool.getConnection();
    // a função query do mysql2 retorna um array [result, fields]
    const [result] = await connection.query(sql, params);
    return result as OkPacket;
  } catch (error) {
    console.error('Erro ao executar ação no banco de dados:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}


// evita race conditions pois cria-se a pool apenas uma vez
const pool: Pool = mysql.createPool(dbConfig);

export async function queryDatabase<T extends RowDataPacket[]>(
  sql: string, 
  params: any[] = []
): Promise<T> {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // query para compatibilidade com LIMIT/OFFSET
    const [results] = await connection.query(sql, params);
    return results as T;
  } catch (error) {
    console.error('Erro na query ao banco de dados:', error);
    throw error;
  } finally {
    // libera a conexão de volta ao pool
    if (connection) {
      connection.release();
    }
  }
}