import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Escola de Futebol Grêmio Concórdia — Unidade Conveniada Grêmio FBPA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: 'linear-gradient(135deg, #050912 0%, #07192b 60%, #005f8f 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: '#009fe3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 900,
            }}
          >
            GF
          </div>
          <span style={{ fontSize: '26px', fontWeight: 800, color: '#7dd3fc' }}>
            UNIDADE CONVENIADA GRÊMIO FBPA · CONCÓRDIA - SC
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '64px', fontWeight: 900, lineHeight: 1.05 }}>
            Escola de Futebol Grêmio Concórdia
          </div>
          <div style={{ fontSize: '28px', color: '#cbd5e1' }}>
            Treinos 3x por semana (4 a 15 anos) · Torneios · Súmulas · 1º Treino Experimental Gratuito
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', color: '#94a3b8' }}>
          <span>Rua Gregório Bressan, São Cristóvão · Concórdia – SC</span>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>WhatsApp: (49) 98896-8754</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
