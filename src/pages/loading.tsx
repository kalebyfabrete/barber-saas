export default function LoadingPage() {
  return (
    <div className="w-full h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-dark-700 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Carregando BarberTech Pro...</p>
      </div>
    </div>
  )
}
