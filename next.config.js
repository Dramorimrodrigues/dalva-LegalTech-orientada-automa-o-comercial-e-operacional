/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    typescript: { ignoreBuildErrors: true },

  // ── Headers de Segurança HTTP ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Previne clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Previne MIME-sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Controla informações de referrer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Restringe funcionalidades do browser
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Proteção XSS (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // HSTS — Força HTTPS (ativar em produção)
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]
            : []),
          // Content-Security-Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data: blob:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
