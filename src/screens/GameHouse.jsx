import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const images = [
  '/src/imagens/2.jpeg',
  '/src/imagens/3.jpeg',
  '/src/imagens/4.jpeg',
  '/src/imagens/5.jpeg',
  '/src/imagens/beyond.webp',
  '/src/imagens/concret.webp',
  '/src/imagens/fortnite.jpg',
  '/src/imagens/hollow.webp',
  '/src/imagens/RE2.jpg',
  '/src/imagens/The-Last-of-Us-Part-II.jpg',
];

export default function GameHouse() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="gamehouse-page" style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', background: 'rgba(0,0,0,0.85)', borderBottom: '2px solid #00d9ff' }}>
        <div className="logo" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src="/src/imagens/cyberlife-icone2.png" alt="CyberLife Logo" style={{height: '80px', verticalAlign: 'middle'}} />
          <span style={{fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#00d9ff', letterSpacing: '2px'}}>CyberLife</span>
        </div>
        <nav className="nav">
          <Link to="/">
            <button style={{
              background: 'none',
              border: 'none',
              color: '#00d9ff',
              fontSize: '1.2rem',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}>
              Início
            </button>
          </Link>
        </nav>
      </header>
      <section className="gamehouse-hero" style={{position: 'relative', minHeight: 'calc(100vh - 120px)', background: 'linear-gradient(90deg, #000 60%, #0ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '32px', opacity: 0.85}}>
        <div style={{position: 'absolute', top: '8vw', left: '5vw', zIndex: 3, textAlign: 'left', maxWidth: '480px'}}>
          <h1 style={{fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '3.2rem', color: '#00d9ff', marginBottom: '18px', letterSpacing: '2px', display: 'inline-block', padding: '12px 32px', borderRadius: '16px', opacity: 1, filter: 'brightness(1.7) drop-shadow(0 0 12px #00d9ff)'}}>Are You Player?</h1>
          <h2 style={{fontFamily: 'Rajdhani, sans-serif', fontWeight: 400, fontSize: '1.3rem', color: '#ff00ea', marginBottom: '0', display: 'inline-block', padding: '8px 24px', borderRadius: '12px', maxWidth: '420px', opacity: 1, filter: 'brightness(1.7) drop-shadow(0 0 12px #ff00ea)'}}>Being a gamer is realizing that real life is very boring!</h2>
        </div>
        <div
          style={{
            width: '100vw',
            maxWidth: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: '60vw',
            maxHeight: '80vh',
            minHeight: '260px',
            overflow: 'hidden',
            marginTop: '64px', // reduzido para aproximar do cabeçalho
            opacity: 0.45,
            borderRadius: '0', // removido arredondamento
            boxShadow: 'none', // removida sombra
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          <img
            src={images[current]}
            alt="GameHouse Banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '0', // removido arredondamento
              boxShadow: 'none', // removida sombra
              transition: 'all 0.5s cubic-bezier(.4,0,.2,1)',
              zIndex: 1,
              border: 'none',
            }}
          />
        </div>
      </section>
    </div>
  );
}
