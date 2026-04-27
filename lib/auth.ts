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

        // 3. Verificar credenciais via variáveis de ambiente
        // PRODUÇÃO: Substituir por consulta ao PostgreSQL
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error('Configuração de autenticação incompleta. Verifique o .env.local');
        }

        if (email !== adminEmail) {
          throw new Error('Credenciais inválidas');
        }

        // 3. Verificar hash da senha com bcrypt
        const passwordValid = await compare(password, adminPasswordHash);
        if (!passwordValid) {
          throw new Error('Credenciais inválidas');
        }

        // 5. Retornar usuário autenticado
        resetRateLimit(email); // Login OK — resetar contador
        return {
          id: '1',
          name: 'Dr. Amorim',
          email: adminEmail,
        };
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
