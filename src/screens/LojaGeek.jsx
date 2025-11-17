import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Instagram, Store, ShoppingBag, MessageCircle, Mail, MapPin, Phone, Zap, Heart, ArrowRight } from 'lucide-react'
import geekConvention from '../imagens/Geek convention-rafiki.png'

// Dados padrão caso não haja dados no localStorage
const defaultOffers = [
  {
    id: 1,
    title: "Mouse Gamer RGB",
    discount: "50% OFF",
    image: "/images/mouse.png",
  },
  {
    id: 2,
    title: "Headset Pro X",
    discount: "40% OFF",
    image: "/images/headset.png",
  },
  {
    id: 3,
    title: "Teclado Mecânico",
    discount: "35% OFF",
    image: "/images/keyboard.png",
  }
]

const defaultProducts = [
  { id: 1, name: 'Funko Pop Batman', category: 'Action Figures', price: 'R$ 129,90', image: '/images/funko1.png', hoverImage: '/images/funko1-hover.png', description: 'Funko Pop oficial do Batman. Colecionável de vinil com aproximadamente 10cm de altura. Perfeito para fãs do Cavaleiro das Trevas e colecionadores.' },
  { id: 2, name: 'Iron Man Mark 85', category: 'Action Figures', price: 'R$ 299,90', image: '/images/ironman.png', hoverImage: '/images/ironman-hover.png', description: 'Action figure premium do Homem de Ferro Mark 85. Alta qualidade de acabamento, articulações móveis e detalhes incríveis. Edição especial Vingadores.' },
  { id: 3, name: 'Caneca Personalizada', category: 'Personalizados', price: 'R$ 49,90', image: '/images/caneca.png', hoverImage: '/images/caneca-hover.png', description: 'Caneca de porcelana 350ml com estampas geek exclusivas. Pode ser personalizada com seu design favorito. Resistente à lava-louças.' },
  { id: 4, name: 'Miniatura Millenium Falcon', category: 'Miniaturas', price: 'R$ 399,90', image: '/images/falcon.png', hoverImage: '/images/falcon-hover.png', description: 'Réplica detalhada da icônica nave Millennium Falcon de Star Wars. Escala 1:100 com mais de 200 peças. Item de colecionador premium.' },
  { id: 5, name: 'Spiderman Legends', category: 'Action Figures', price: 'R$ 199,90', image: '/images/spider.png', hoverImage: '/images/spider-hover.png', description: 'Action figure Marvel Legends do Homem-Aranha. Múltiplos pontos de articulação, acessórios inclusos e acabamento perfeito para poses dinâmicas.' },
  { id: 6, name: 'Mousepad Gamer Custom', category: 'Personalizados', price: 'R$ 79,90', image: '/images/mousepad.png', hoverImage: '/images/mousepad-hover.png', description: 'Mousepad gamer XXL 90x40cm com designs exclusivos. Base antiderrapante e superfície de alta precisão. Perfeito para setup gamer.' },
  { id: 7, name: 'Mini DeLorean', category: 'Miniaturas', price: 'R$ 189,90', image: '/images/delorean.png', hoverImage: '/images/delorean-hover.png', description: 'Miniatura oficial do DeLorean de De Volta para o Futuro. Escala 1:24 com portas que abrem e detalhes luminosos. Peça de coleção autêntica.' },
  { id: 8, name: 'Camiseta Geek', category: 'Personalizados', price: 'R$ 89,90', image: '/images/camiseta.png', hoverImage: '/images/camiseta-hover.png', description: 'Camiseta 100% algodão com estampas geek exclusivas. Alta qualidade de impressão, várias cores e tamanhos disponíveis. Confortável e durável.' },
]

export default function LojaGeek({ onBack }){
  const navigate = useNavigate()
  const [currentOffer, setCurrentOffer] = useState(0)
  const [isOffersVisible, setIsOffersVisible] = useState(false)
  const [isCatalogVisible, setIsCatalogVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [offers, setOffers] = useState([])
  const [products, setProducts] = useState([])
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const offersRef = useRef(null)
  const catalogRef = useRef(null)
  const productsPerPage = 8
  
  // Carregar dados do localStorage
  useEffect(() => {
    const storedOffers = localStorage.getItem('cyberlife_offers')
    const storedProducts = localStorage.getItem('cyberlife_products')
    
    setOffers(storedOffers ? JSON.parse(storedOffers) : defaultOffers)
    setProducts(storedProducts ? JSON.parse(storedProducts) : defaultProducts)
    
    // Salvar dados padrão se não existirem
    if (!storedOffers) {
      localStorage.setItem('cyberlife_offers', JSON.stringify(defaultOffers))
    }
    if (!storedProducts) {
      localStorage.setItem('cyberlife_products', JSON.stringify(defaultProducts))
    }

    // Carregar quantidade de itens no carrinho
    updateCartCount()
  }, [])

  const updateCartCount = () => {
    const storedCart = localStorage.getItem('cyberlife_cart')
    if (storedCart) {
      const cart = JSON.parse(storedCart)
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartItemsCount(totalItems)
    } else {
      setCartItemsCount(0)
    }
  }

  const handleAddToCart = (product) => {
    const storedCart = localStorage.getItem('cyberlife_cart')
    let cart = storedCart ? JSON.parse(storedCart) : []
    
    const existingItemIndex = cart.findIndex(item => item.id === product.id)
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      })
    }
    
    localStorage.setItem('cyberlife_cart', JSON.stringify(cart))
    updateCartCount()
  }
  
  const scrollToOffers = () => {
    console.log('scrollToOffers chamado', offersRef.current)
    if (offersRef.current) {
      offersRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      })
      setIsOffersVisible(true)
    }
  }

  const scrollToCatalog = () => {
    console.log('scrollToCatalog chamado', catalogRef.current)
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      })
      setIsCatalogVisible(true)
    }
  }
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === offersRef.current) {
              setIsOffersVisible(true)
            }
            if (entry.target === catalogRef.current) {
              setIsCatalogVisible(true)
            }
          }
        })
      },
      { threshold: 0.2 }
    )
    
    if (offersRef.current) {
      observer.observe(offersRef.current)
    }
    if (catalogRef.current) {
      observer.observe(catalogRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (offers.length > 0) {
      const timer = setInterval(() => {
        setCurrentOffer((prev) => (prev + 1) % offers.length)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [offers.length])

  const offer = offers[currentOffer] || {}

  const categories = ['Todos', 'Action Figures', 'Personalizados', 'Miniaturas']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Reset para página 1 quando mudar filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Frases rotativas para o subtítulo do hero
  const heroSubtitles = [
    "Produtos exclusivos para quem vive a cultura tech, games e sci-fi",
    "Ofertas imbatíveis para geeks de verdade!",
    "Colecionáveis com qualidade lendária"
  ];
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentSubtitle((prev) => (prev + 1) % heroSubtitles.length);
        setIsSliding(false);
      }, 400);
    }, 3200);
    return () => clearTimeout(timer);
  }, [currentSubtitle])

  return (
    <div className="loja-geek" style={{overflowX: 'hidden', width: '100%', maxWidth: '100vw'}}>
      <header className="header">
        <div className="logo" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src="/cyberlife-icone2.png" alt="CyberLife Logo" style={{height: '80px', verticalAlign: 'middle'}} />
          <span style={{fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#00d9ff', letterSpacing: '2px'}}>CyberLife</span>
        </div>
        <nav className="nav">
          <button className="nav-button" onClick={onBack}>Início</button>
          <button className="nav-button">Contato</button>
          <button className="nav-button cart-button" onClick={() => window.location.href = '/carrinho'}>
            <ShoppingCart size={28} strokeWidth={2.5} />
            <span className="cart-badge">{cartItemsCount}</span>
          </button>
        </nav>
      </header>

  <section className="hero-geek">
        <div className="hero-content">
          <div className="hero-title-wrapper">
            <h1 className="hero-title-line1">Loja Geek</h1>
            <h1 className="hero-title-line2">CyberLife!</h1>
          </div>
          <p className={`hero-subtitle${isSliding ? ' slide-up' : ''}`} style={{minHeight: '2.2em'}}>
            {heroSubtitles[currentSubtitle]}
          </p>
          <div className="hero-cta">
            <button className="cta-button primary" onClick={scrollToCatalog}>Explorar Produtos</button>
            <button className="cta-button secondary" onClick={scrollToOffers}>Ver Ofertas</button>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="cyber-grid"></div>
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="scan-line"></div>
          <div className="particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="hexagon hex-1"></div>
          <div className="hexagon hex-2"></div>
          <div className="hexagon hex-3"></div>
        </div>
        <img 
          src={"/cyberlife-icone2.png"}
          alt="CyberLife Ícone 2"
          className="hero-bg-animated"
        />
        <div className="scroll-indicator">
          <div className="scroll-arrow" onClick={scrollToOffers}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 5 L25 40" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeDasharray="2 3"/>
              <polygon points="25,35 18,25 32,25" fill="currentColor" opacity="0.3"/>
              <polygon points="25,45 15,30 35,30" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
              <circle cx="25" cy="12" r="3" fill="currentColor"/>
              <path d="M10 20 L40 20" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
              <path d="M10 40 L40 40" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
            </svg>
            <span className="scroll-text">SCROLL</span>
          </div>
        </div>
      </section>

      <section className={`offers-section ${isOffersVisible ? 'visible' : ''}`} ref={offersRef} style={{position: 'relative', overflow: 'hidden'}}>
        <img 
          src={"/cyberlife-icone2.png"}
          alt="CyberLife Ícone"
          className="offers-bg-animated"
        />
        <div className="section-header">
          <h2 className="section-title">Ofertas Sazonais</h2>
          <p className="section-subtitle">Promoções exclusivas por tempo limitado</p>
        </div>
        
        <div className="carousel-container">
          <div className="offer-card-large">
            <div className="offer-tag">{offer.tag}</div>
            <div className="offer-discount-badge">{offer.discount}</div>
            
            <div className="offer-split">
              <div className="offer-image-side">
                <div className="offer-glow"></div>
                <img src={offer.image} alt={offer.title} className="offer-image" />
              </div>
              
              <div className="offer-content-side">
                <h3 className="offer-title">{offer.title}</h3>
                <div className="offer-prices">
                  <div className="price-block">
                    <span className="price-label">De:</span>
                    <span className="price-original">{offer.originalPrice}</span>
                  </div>
                  <div className="price-block">
                    <span className="price-label">Por:</span>
                    <span className="price-final">{offer.finalPrice}</span>
                  </div>
                </div>
                <button className="offer-button">Comprar Agora</button>
              </div>
            </div>

            <div className="carousel-indicators">
              {offers.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentOffer ? 'active' : ''}`}
                  onClick={() => setCurrentOffer(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`catalog-section ${isCatalogVisible ? 'visible' : ''}`} ref={catalogRef}>
        <div className="section-header">
          <h2 className="section-title">Catálogo de Produtos</h2>
          <p className="section-subtitle">Explore nossa coleção completa</p>
        </div>

        <div className="catalog-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div 
                className="product-image-wrapper" 
                onClick={() => navigate(`/produto/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img src={product.image} alt={product.name} className="product-image default" />
                <img src={product.hoverImage} alt={product.name} className="product-image hover" />
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 
                  className="product-name" 
                  onClick={() => navigate(`/produto/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {product.name}
                </h3>
                <p className="product-price">{product.price}</p>
                <button className="product-btn" onClick={() => handleAddToCart(product)}>Adicionar ao Carrinho</button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>Nenhum produto encontrado</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>
            
            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button 
              className="pagination-btn next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próximo →
            </button>
          </div>
        )}
      </section>

      {/* Rodapé CyberLife - Novo Design Tech */}
      <footer className="footer-cyberlife-new" style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a0033 50%, #0f0015 100%)',
        color: '#00d9ff',
        padding: '80px 20px 40px 20px',
        marginTop: '80px',
        fontFamily: 'Rajdhani, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Animated Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 234, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          animation: 'gradientShift 15s ease infinite',
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center',
            marginBottom: '80px',
          }} className="footer-main-grid">
            {/* Left Side - Image */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '350px',
                filter: 'drop-shadow(0 0 30px rgba(0, 217, 255, 0.3))',
                animation: 'float 6s ease-in-out infinite',
              }}>
                <img 
                  src={geekConvention} 
                  alt="Geek Convention" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    border: '2px solid rgba(0, 217, 255, 0.3)',
                    background: 'rgba(0, 217, 255, 0.05)',
                    padding: '15px',
                    boxShadow: 'inset 0 0 30px rgba(0, 217, 255, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  className="footer-image"
                />
              </div>
            </div>

            {/* Right Side - Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
            }}>
              <div>
                <div style={{
                  fontSize: '3.5rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #00d9ff 0%, #ff00ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '15px',
                  letterSpacing: '-1px',
                }}>CyberLife</div>
                <div style={{
                  fontSize: '1.3rem',
                  color: '#00d9ff',
                  fontWeight: 500,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <Zap size={24} fill='currentColor' />
                  Sua Loja Geek Premium
                </div>
                <p style={{
                  color: '#aaa',
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                  marginBottom: '20px',
                }}>
                  Bem-vindo ao universo geek! Aqui você encontra os melhores produtos, personalizados, ação figures e tudo que um fã de tecnologia precisa. Venha fazer parte da nossa comunidade!
                </p>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
              }}>
                <div style={{
                  background: 'rgba(0, 217, 255, 0.1)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }} className="stat-card-hover">
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#00d9ff',
                    marginBottom: '5px',
                  }}>500+</div>
                  <div style={{
                    fontSize: '0.95rem',
                    color: '#aaa',
                    fontWeight: 500,
                  }}>Produtos</div>
                </div>
                <div style={{
                  background: 'rgba(255, 0, 234, 0.1)',
                  border: '1px solid rgba(255, 0, 234, 0.3)',
                  borderRadius: '15px',
                  padding: '20px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }} className="stat-card-hover">
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#ff00ea',
                    marginBottom: '5px',
                  }}>10K+</div>
                  <div style={{
                    fontSize: '0.95rem',
                    color: '#aaa',
                    fontWeight: 500,
                  }}>Clientes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.5), transparent)',
            marginBottom: '60px',
          }} />

          {/* Footer Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px',
            marginBottom: '50px',
          }} className="footer-cards-grid">
            {/* Contact Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.05) 0%, rgba(37, 211, 102, 0.02) 100%)',
              border: '1px solid rgba(37, 211, 102, 0.2)',
              borderRadius: '18px',
              padding: '30px',
              transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
              position: 'relative',
              overflow: 'hidden',
            }} className="footer-card-hover">
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                right: '-50%',
                bottom: '-50%',
                background: 'radial-gradient(circle, rgba(37, 211, 102, 0.1) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s',
                pointerEvents: 'none',
              }} className="card-glow" />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
              }}>
                <MessageCircle size={28} style={{ color: '#25D366' }} />
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}>Contato</div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                zIndex: 1,
              }}>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#25D366',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  transition: 'all 0.3s',
                  padding: '10px 12px',
                  borderRadius: '10px',
                }} className="footer-link-hover">
                  <span style={{ width: '4px', height: '4px', background: '#25D366', borderRadius: '50%' }} />
                  WhatsApp
                  <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0, transition: 'all 0.3s' }} className="arrow-icon" />
                </a>
                <a href="https://instagram.com/cyberlife" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#ff00ea',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  transition: 'all 0.3s',
                  padding: '10px 12px',
                  borderRadius: '10px',
                }} className="footer-link-hover">
                  <span style={{ width: '4px', height: '4px', background: '#ff00ea', borderRadius: '50%' }} />
                  Instagram
                  <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0, transition: 'all 0.3s' }} className="arrow-icon" />
                </a>
              </div>
            </div>

            {/* Online Stores Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 230, 0, 0.05) 0%, rgba(255, 230, 0, 0.02) 100%)',
              border: '1px solid rgba(255, 230, 0, 0.2)',
              borderRadius: '18px',
              padding: '30px',
              transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
              position: 'relative',
              overflow: 'hidden',
            }} className="footer-card-hover">
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                right: '-50%',
                bottom: '-50%',
                background: 'radial-gradient(circle, rgba(255, 230, 0, 0.1) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s',
                pointerEvents: 'none',
              }} className="card-glow" />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
              }}>
                <Store size={28} style={{ color: '#ffe600' }} />
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}>Lojas Online</div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                zIndex: 1,
              }}>
                <a href="https://www.mercadolivre.com.br/perfil/cyberlife" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#ffe600',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  transition: 'all 0.3s',
                  padding: '10px 12px',
                  borderRadius: '10px',
                }} className="footer-link-hover">
                  <span style={{ width: '4px', height: '4px', background: '#ffe600', borderRadius: '50%' }} />
                  Mercado Livre
                  <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0, transition: 'all 0.3s' }} className="arrow-icon" />
                </a>
                <a href="https://shopee.com.br/talisson00" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#ff5722',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  transition: 'all 0.3s',
                  padding: '10px 12px',
                  borderRadius: '10px',
                }} className="footer-link-hover">
                  <span style={{ width: '4px', height: '4px', background: '#ff5722', borderRadius: '50%' }} />
                  Shopee
                  <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0, transition: 'all 0.3s' }} className="arrow-icon" />
                </a>
              </div>
            </div>

            {/* Partners Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 174, 0.05) 0%, rgba(0, 255, 174, 0.02) 100%)',
              border: '1px solid rgba(0, 255, 174, 0.2)',
              borderRadius: '18px',
              padding: '30px',
              transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
              position: 'relative',
              overflow: 'hidden',
            }} className="footer-card-hover">
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                right: '-50%',
                bottom: '-50%',
                background: 'radial-gradient(circle, rgba(0, 255, 174, 0.1) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s',
                pointerEvents: 'none',
              }} className="card-glow" />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
              }}>
                <Heart size={28} style={{ color: '#00ffae' }} />
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}>Parceiros</div>
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
                zIndex: 1,
              }}>
                {['MeB Informatica', 'Teste Decorações', 'Grupo Raval', 'Eletrobuty'].map((partner, idx) => (
                  <li key={idx} style={{
                    color: '#00ffae',
                    fontWeight: 500,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'default',
                  }} className="partner-item-hover">
                    <span style={{ width: '4px', height: '4px', background: '#00ffae', borderRadius: '50%' }} />
                    {partner}
                  </li>
                ))}
              </ul>
            </div>

            {/* Location Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(0, 217, 255, 0.02) 100%)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '18px',
              padding: '30px',
              transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
              position: 'relative',
              overflow: 'hidden',
            }} className="footer-card-hover">
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                right: '-50%',
                bottom: '-50%',
                background: 'radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s',
                pointerEvents: 'none',
              }} className="card-glow" />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
              }}>
                <MapPin size={28} style={{ color: '#00d9ff' }} />
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}>Localização</div>
              </div>
              <div style={{
                color: '#00d9ff',
                fontSize: '1.15rem',
                fontWeight: 600,
                position: 'relative',
                zIndex: 1,
              }}>Guaíra-SP</div>
              <div style={{
                color: '#aaa',
                fontSize: '0.95rem',
                marginTop: '10px',
                position: 'relative',
                zIndex: 1,
              }}>Brasil</div>
            </div>
          </div>

          {/* Bottom Section */}
          <div style={{
            borderTop: '1px solid rgba(0, 217, 255, 0.2)',
            paddingTop: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }} className="footer-bottom">
            <div style={{
              fontSize: '0.95rem',
              color: '#aaa',
            }}>
              &copy; {new Date().getFullYear()} <span style={{ color: '#00d9ff', fontWeight: 'bold' }}>CyberLife</span>. Todos os direitos reservados.
            </div>
            <div style={{
              fontSize: '0.95rem',
              color: '#aaa',
            }}>
              Desenvolvido com <span style={{ color: '#ff00ea' }}>❤</span> por <span style={{ color: '#00d9ff', fontWeight: 'bold' }}>CyberLife</span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
          }

          @keyframes gradientShift {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(10deg); }
          }

          @media (max-width: 768px) {
            .footer-main-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }

            .footer-cards-grid {
              grid-template-columns: 1fr !important;
            }

            .footer-bottom {
              flex-direction: column !important;
              text-align: center !important;
            }
          }

          .footer-card-hover:hover {
            transform: translateY(-12px);
            box-shadow: 0 20px 60px rgba(0, 217, 255, 0.15);
            border-color: rgba(0, 217, 255, 0.5) !important;
          }

          .footer-card-hover:hover .card-glow {
            opacity: 1 !important;
          }

          .footer-link-hover:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            transform: translateX(8px) !important;
          }

          .footer-link-hover:hover .arrow-icon {
            opacity: 1 !important;
            transform: translateX(4px) !important;
          }

          .partner-item-hover:hover {
            background: rgba(0, 255, 174, 0.1) !important;
            color: #fff !important;
            text-shadow: 0 0 12px rgba(0, 255, 174, 0.5) !important;
            transform: translateX(6px) !important;
          }

          .stat-card-hover:hover {
            transform: scale(1.08);
            box-shadow: 0 0 30px rgba(0, 217, 255, 0.2);
          }

          .footer-image:hover {
            transform: scale(1.05) rotate(2deg);
            border-color: rgba(0, 217, 255, 0.6) !important;
            filter: drop-shadow(0 0 40px rgba(0, 217, 255, 0.4)) !important;
          }
        `}</style>
      </footer>
    </div>
  )
}

// Adicione ao CSS global ou local:
/*
.hero-subtitle {
  display: inline-block;
  transition: transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s cubic-bezier(.4,0,.2,1);
}
.hero-subtitle.slide-up {
  transform: translateY(-32px);
  opacity: 0;
}
*/
