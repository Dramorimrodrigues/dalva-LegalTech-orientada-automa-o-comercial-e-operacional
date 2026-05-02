// =============================================================
// DALVA — Auth Configuration (Server-side)
// =============================================================

import type { NextAuthOptions, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { checkRateLimit, resetRateLimit } from './rate-limit';

// Schema de validação do login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Tipagem customizada para sessão
interface DalvaUser extends User {
  id: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials): Promise<DalvaUser | null> {
        // 1. Validar input com Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error('Dados inválidos');
        }

        const { email, password } = parsed.data;

        // 2. Rate limiting — máx 5 tentativas por 15 min
        const rateCheck = checkRateLimit(email);
        if (!rateCheck.allowed) {
          const minutes = Math.ceil(rateCheck.retryAfterMs / 60000);
          throw new Error(`Muitas tentativas. Tente novamente em ${minutes} minuto(s).`);
        }

        // 3. Buscar usuário no PostgreSQL
        try {
          const { prisma } = require('./db');

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              passwordHash: true,
              role: true,
            },
          });

          if (!user) {
            throw new Error('Credenciais inválidas');
          }

          // 4. Verificar hash da senha com bcrypt
          const passwordValid = await compare(password, user.passwordHash);
          if (!passwordValid) {
            throw new Error('Credenciais inválidas');
          }

          // 5. Retornar usuário autenticado
          resetRateLimit(email); // Login OK — resetar contador
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error: any) {
          // Se erro de conexão BD, fazer fallback para variáveis de env
          if (error.message.includes('Credenciais inválidas')) {
            throw error;
          }

          console.warn('Erro ao buscar usuário no BD, usando fallback:', error.message);

          // Fallback: tentar com variáveis de ambiente
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

          if (!adminEmail || !adminPasswordHash) {
            throw new Error('Configuração de autenticação incompleta');
          }

          if (email !== adminEmail) {
            throw new Error('Credenciais inválidas');
          }

          const passwordValid = await compare(password, adminPasswordHash);
          if (!passwordValid) {
            throw new Error('Credenciais inválidas');
          }

          resetRateLimit(email);
          return {
            id: '1',
            name: 'Dr. Amorim',
            email: adminEmail,
          };
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 horas (sessão de trabalho)
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: DalvaUser | User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as DalvaUser).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
