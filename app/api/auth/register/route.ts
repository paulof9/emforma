import { NextRequest, NextResponse } from 'next/server';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { dbConfig } from '@/lib/config';

export async function POST(req: NextRequest) {
    let connection;
    try {
        const body = await req.json();
        const { nome, email, password } = body;

        // validação
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email e senha são obrigatórios.' },
                { status: 400 }
            );
        }

        connection = await mysql.createConnection({
            ...dbConfig,
            ssl: { rejectUnauthorized: true }
        });
        console.log("CONECTADO AO BANCO DE DADOS! (API Register)");

        // verificar se usuario ja existe
        const [existingUsers] = await connection.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return NextResponse.json(
                { message: 'Este email já está em uso.' },
                { status: 409 }
            );
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir o novo usuário no banco de dados
        const [result] = await connection.execute<ResultSetHeader>(
            'INSERT INTO usuarios (nome, email, password_hash) VALUES (?, ?, ?)',
            [nome || null, email, hashedPassword]
        );

        console.log(`Usuário registrado com sucesso com o ID: ${result.insertId}`);
        return NextResponse.json(
            { message: 'Usuário registrado com sucesso!', userId: result.insertId },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erro na API de registro /api/auth/register:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: 'Corpo da requisição inválido, esperado JSON.' }, { status: 400 });
        }
        return NextResponse.json(
            { message: 'Erro interno do servidor ao registrar usuário.', errorDetails: errorMessage },
            { status: 500 }
        );
    } finally {
        if (connection) {
            try {
                await connection.end();
                console.log('Conexão com o banco de dados fechada. (API Register)');
            } catch (closeError) {
                console.error('Erro ao fechar a conexão:', closeError);
            }
        }
    }
}