import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt-utils';

// Credenciais padrão
const ADMIN_EMAIL = 'marcioluisamorim@gmail.com';
const ADMIN_PASSWORD = 'Dalva@2024';

export async function POST(request: NextRequest) {
    try {
          const { email, password } = await request.json();

          // Validação
          if (!email || !password) {
                  return NextResponse.json(
                            { error: 'Email e senha são obrigatórios' },
                            { status: 400 }
                          );
                }

          // Valida credenciais
          if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
                  return NextResponse.json(
                            { error: 'Email ou senha inválidos' },
                            { status: 401 }
                          );
                }

          // Gera token JWT
          const token = generateToken('admin-user-001', 'org-amorim');

          // Cria response
          const response = NextResponse.json(
                  { 
                            success: true,
                            message: 'Login realizado com sucesso!',
                            user: { 
                                        id: 'admin-user-001',
                                        email: ADMIN_EMAIL,
                                        name: 'Marcio Luis De Amorim Rodrigues',
                                        orgId: 'org-amorim',
                                      },
                          },
                  { status: 200 }
                );

          // Define cookie HTTP-only
          response.cookies.set('auth-token', token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'lax',
                  maxAge: 60 * 60 * 24 * 7,
                  path: '/',
                });

          return response;

        } catch (error) {
          console.error('Login error:', error);
          return NextResponse.json(
                  { error: 'Erro ao fazer login' },
                  { status: 500 }
                );
        }
  }
