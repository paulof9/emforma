import { NextRequest, NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { dbConfig, JWT_SECRET, MAX_AGE_COOKIE } from '@/lib/config';
import { User, JwtPayload } from '@/types/authInterface';


export async function POST(req: NextRequest) {
    if (!JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET não está definida nas variáveis de ambiente.');
        return NextResponse.json(
            { message: 'Erro de configuração interna do servidor. JWT Secret não definida.' },
            { status: 500 }
        );
    }
    const jwtSecret: Secret = JWT_SECRET;

    let connection;
    try {
        const body = await req.json();
        const { email, password } = body;

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
        console.log("CONECTADO AO BANCO DE DADOS! (App Router)");

        const [rows] = await connection.execute<RowDataPacket[]>(
            'SELECT id, email, password_hash, nome FROM usuarios WHERE email = ?',
            [email]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            console.log(`Usuário não encontrado para o email: ${email} (App Router)`);
            return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
        }

        const user = rows[0] as User;

        if (!user.password_hash) {
            console.error('Coluna password_hash não encontrada para o usuário (após query):', user.email);
            return NextResponse.json(
                { message: 'Erro de configuração do usuário no servidor.' },
                { status: 500 }
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            console.log(`Senha incorreta para o usuário: ${email} (App Router)`);
            return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
        }

        const tokenPayload: JwtPayload = {
            userId: user.id,
            email: user.email,
            name: user.nome,
        };
        const signOptions: SignOptions = { expiresIn: `${MAX_AGE_COOKIE}s` };
        const token = jwt.sign(tokenPayload, jwtSecret, signOptions);

        console.log(`Login bem-sucedido para o usuário: ${email} (App Router)`);
        
        const response = NextResponse.json(
            { message: 'Login bem-sucedido!', user: { id: user.id, email: user.email, name: user.nome } },
            { status: 200 }
        );

        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'lax',
            maxAge: MAX_AGE_COOKIE,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Erro no Route Handler de login /api/auth/login:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido durante o login.';
        if (error instanceof SyntaxError && (error as any).message.includes("JSON")) {
             return NextResponse.json({ message: 'Corpo da requisição inválido, esperado JSON.' }, { status: 400 });
        }
        return NextResponse.json(
            { message: 'Erro interno do servidor ao tentar fazer login.', errorDetails: errorMessage },
            { status: 500 }
        );
    } finally {
        if (connection) {
            try {
                await connection.end();
                console.log('Conexão com o banco de dados fechada. (App Router)');
            } catch (closeError) {
                console.error('Erro ao fechar a conexão com o banco de dados:', closeError);
            }
        }
    }
}