import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import useAccessLog from './hooks/useAccessLog'
import StartScreen from './screens/StartScreen'
import NextScreen from './screens/NextScreen'
import LojaGeek from './screens/LojaGeek'
import AdminPanel from './screens/AdminPanel'
import CarrinhoPage from './screens/CarrinhoPage'
import GameHouse from './screens/GameHouse'
import ProductDetailPage from './screens/ProductDetailPage'

// Componente para registrar acessos
function AccessLogger({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Verificar usuário logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null)
    })

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Registrar acesso
  useAccessLog(currentUser, location.pathname)

  return children
}

function StartWrapper() {
  const navigate = useNavigate()
  return <StartScreen onStart={() => navigate('/menu')} />
}

function MenuWrapper() {
  const navigate = useNavigate()
  return <NextScreen onNavigate={(page) => navigate(`/${page}`)} />
}

function LojaWrapper() {
  const navigate = useNavigate()
  return <LojaGeek onBack={() => navigate('/menu')} />
}

function AdminWrapper() {
  const navigate = useNavigate()
  return <AdminPanel onNavigate={(page) => navigate(`/${page}`)} />
}

function CarrinhoWrapper() {
  const navigate = useNavigate()
  return <CarrinhoPage onBack={() => navigate('/loja-geek')} />
}

function GameHouseWrapper() {
  const navigate = useNavigate()
  return <GameHouse onBack={() => navigate('/menu')} />
}

export default function App(){
  return (
    <BrowserRouter>
      <AccessLogger>
        <Routes>
          <Route path="/" element={<StartWrapper />} />
          <Route path="/menu" element={<MenuWrapper />} />
          <Route path="/loja-geek" element={<LojaWrapper />} />
          <Route path="/produto/:id" element={<ProductDetailPage />} />
          <Route path="/carrinho" element={<CarrinhoWrapper />} />
          <Route path="/admin" element={<AdminWrapper />} />
          <Route path="/loja-geek/admin" element={<AdminWrapper />} />
          <Route path="/game-house" element={<GameHouseWrapper />} />
        </Routes>
      </AccessLogger>
    </BrowserRouter>
  )
}
