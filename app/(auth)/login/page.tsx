'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bot, Eye, EyeOff, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { z } from 'zod';

// Validação do formulário de login
const loginSchema = z.object({
  email: z.string().email('Informe um email válido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

// Wrapper com Suspense para useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dalva-bg flex items-center justify-center">
        <span className="text-gradient-gold text-3xl font-bold animate-pulse-soft">Dalva</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Validar input com Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginErrors;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // 2. Autenticar via NextAuth
    setLoading(true);
    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        setErrors({ general: 'Email ou senha inválidos' });
        setLoading(false);
        return;
      }

      // 3. Sucesso — redirecionar
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrors({ general: 'Erro ao conectar. Tente novamente.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background with gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0B0F1A 0%, #111827 40%, #1A2035 70%, #0B0F1A 100%)',
          }}
        />

        {/* Gold mesh overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(201, 168, 76, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
          }}
        />

        {/* Decorative lines */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] w-[400px] h-[1px] bg-gradient-to-r from-transparent via-dalva-gold/20 to-transparent rotate-[30deg]" />
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-dalva-gold/10 to-transparent rotate-[30deg]" />
          <div className="absolute bottom-[30%] left-[5%] w-[350px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent rotate-[-20deg]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dalva-gold to-dalva-gold-soft flex items-center justify-center shadow-gold">
                <Bot className="w-7 h-7 text-dalva-bg" />
              </div>
              <div>
                <h1 className="text-gradient-gold text-3xl font-bold">Dalva</h1>
                <p className="text-[11px] text-dalva-text-muted tracking-[0.2em] uppercase">
                  PLATAFORMA LEGALTECH
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-dalva-text-primary leading-tight mb-4">
            Transforme seu
            <br />
            escritório em uma
            <br />
            <span className="text-gradient-gold">máquina de captação</span>
          </h2>

          <p className="text-base text-dalva-text-secondary max-w-md leading-relaxed mb-10">
            Captação automatizada via WhatsApp com IA, qualificação inteligente de leads e
            conversão de clientes 24/7.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { value: '42%', label: 'Taxa de Conversão' },
              { value: '12s', label: 'Tempo de Resposta' },
              { value: '24/7', label: 'Disponibilidade' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-dalva-gold">{stat.value}</p>
                <p className="text-xs text-dalva-text-muted mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div className="absolute bottom-8 left-16 flex items-center gap-2 text-dalva-text-muted">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Proteção LGPD · Compliance OAB · Dados criptografados</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 bg-dalva-bg">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dalva-gold to-dalva-gold-soft flex items-center justify-center">
              <Bot className="w-6 h-6 text-dalva-bg" />
            </div>
            <h1 className="text-gradient-gold text-2xl font-bold">Dalva</h1>
          </div>

          <h3 className="text-xl font-bold text-dalva-text-primary mb-1">Bem-vindo de volta</h3>
          <p className="text-sm text-dalva-text-muted mb-8">
            Acesse o painel de gestão do seu escritório
          </p>

          {/* Error Alert */}
          {errors.general && (
            <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-dalva-red-muted border border-red-500/20 text-red-400 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-dalva-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.amorim@escritorio.com"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-xl text-sm bg-dalva-surface border text-dalva-text-primary placeholder:text-dalva-text-muted outline-none transition-all ${
                  errors.email
                    ? 'border-red-500/50 focus:border-red-500/70'
                    : 'border-dalva-border focus:border-dalva-gold/40 focus:shadow-gold'
                }`}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-dalva-text-secondary mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-dalva-surface border text-dalva-text-primary placeholder:text-dalva-text-muted outline-none transition-all pr-11 ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : 'border-dalva-border focus:border-dalva-gold/40 focus:shadow-gold'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dalva-text-muted hover:text-dalva-text-secondary transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-dalva-gold to-dalva-gold-soft text-dalva-bg hover:opacity-90 transition-all disabled:opacity-60 shadow-gold mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dalva-bg/30 border-t-dalva-bg rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>



          {/* Footer */}
          <p className="text-center text-[11px] text-dalva-text-muted mt-8">
            Dalva © 2026 — Amorim Rodrigues Advogados
            <br />
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
