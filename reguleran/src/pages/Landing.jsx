import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Music,
  ListMusic,
  CalendarCheck,
  Mic2,
  Users,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Play,
  Clock,
  Shield,
  ChevronDown,
} from 'lucide-react'
import useAuthStore from '../stores/authStore'

const features = [
  {
    icon: Music,
    title: 'Manajemen Lagu',
    desc: 'Simpan chord, lirik, dan nada dasar. Transpose otomatis dengan satu klik.',
  },
  {
    icon: ListMusic,
    title: 'Setlist Cerdas',
    desc: 'Buat setlist untuk setiap manggung. Urutkan, edit, dan bagikan ke tim.',
  },
  {
    icon: CalendarCheck,
    title: 'Sesi & Jadwal',
    desc: 'Atur jadwal latihan dan manggung. Pantau siapa saja yang konfirmasi.',
  },
  {
    icon: Mic2,
    title: 'Transpose Otomatis',
    desc: 'Ubah nada dasar semua lagu dalam setlist secara instan. Sangat praktis.',
  },
  {
    icon: Users,
    title: 'Kolaborasi Tim',
    desc: 'Akses lagu dan setlist secara real-time. Semua tim bisa berkontribusi.',
  },
  {
    icon: Sparkles,
    title: 'Modern & Cepat',
    desc: 'Dibangun dengan teknologi terkini. Responsif di semua perangkat.',
  },
]

const stats = [
  { value: '500+', label: 'Lagu Siap Main' },
  { value: '200+', label: 'Player Aktif' },
  { value: '1000+', label: 'Musisi Terbantu' },
  { value: '99.9%', label: 'Uptime' },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { user } = useAuthStore()
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-neutral-500/15 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neutral-500/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-neutral-500/8 blur-[80px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
                <Music size={18} className="text-neutral-900" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl tracking-wide">Reguleran</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Fitur</a>
              <a href="#stats" className="text-sm text-white/70 hover:text-white transition-colors">Statistik</a>
              {user ? (
                <Link
                  to="/app"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-900 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.97]"
                >
                  <span>Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200">
                    Masuk
                  </Link>
                  <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-900 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.97]">
                    <span>Daftar Gratis</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenu(false)} className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">Fitur</a>
              <a href="#stats" onClick={() => setMobileMenu(false)} className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">Statistik</a>
              <div className="pt-2 space-y-2">
                {user ? (
                  <Link to="/app" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 text-white font-medium">
                    <span>Dashboard</span>
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenu(false)} className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">Masuk</Link>
                    <Link to="/register" onClick={() => setMobileMenu(false)} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white text-neutral-900 font-medium">
                      <span>Daftar Gratis</span>
                      <ArrowRight size={16} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm animate-fade-in-up">
                <Sparkles size={14} />
                <span>Platform Live Musik Modern</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display leading-tight animate-fade-in-up animate-delay-100">
                Satu Platform untuk
                <br />
                <span className="gradient-text">Seluruh Ekosistem</span>
                <br />
                Live Music
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-lg leading-relaxed animate-fade-in-up animate-delay-200">
                Reguleran menyatukan manajemen katalog lagu, penyusunan setlist,
                dan sinkronisasi jadwal manggung untuk player, session musician,
                hingga artis dalam satu ekosistem yang terintegrasi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-300">
                {user ? (
                  <Link to="/app" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-neutral-900 font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.97] text-lg">
                    <span>Buka Dashboard</span>
                    <ArrowRight size={20} />
                  </Link>
                ) : (
                  <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-neutral-900 font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.97] text-lg">
                    <span>Mulai Gratis</span>
                    <ArrowRight size={20} />
                  </Link>
                )}
                <button onClick={scrollToFeatures} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 text-white/80 hover:text-white font-medium transition-all duration-200 active:scale-[0.97] text-lg">
                  <Play size={18} />
                  <span>Lihat Fitur</span>
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-white/40 animate-fade-in-up animate-delay-400">
                <div className="flex items-center gap-2">
                  <Shield size={14} />
                  <span>Gratis selamanya</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>Setup 5 menit</span>
                </div>
              </div>
            </div>

            <div className="relative lg:block animate-fade-in animate-delay-200">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl blur-3xl" />
                <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-neutral-500" />
                    <div className="w-3 h-3 rounded-full bg-neutral-500" />
                    <div className="w-3 h-3 rounded-full bg-neutral-500" />
                    <div className="ml-4 text-xs text-white/40 font-mono">reguleran.app</div>
                  </div>
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <Music size={16} className="text-white" />
                        </div>
                        <span className="font-display text-sm">Dashboard</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/60" />
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Lagu', value: '24', color: 'from-white/60 to-white/30' },
                        { label: 'Setlist', value: '8', color: 'from-white/60 to-white/30' },
                        { label: 'Sesi', value: '12', color: 'from-white/60 to-white/30' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl bg-white/5 p-3 text-center border border-white/5">
                          <div className={`text-xl font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>
                            {item.value}
                          </div>
                          <div className="text-[10px] text-white/40 mt-0.5">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                          <span className="text-xs text-white/70 truncate">Autumn Leaves</span>
                        </div>
                        <span className="text-[10px] text-white/30 shrink-0 ml-2">Am</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                          <span className="text-xs text-white/70 truncate">Fly Me to the Moon</span>
                        </div>
                        <span className="text-[10px] text-white/30 shrink-0 ml-2">C</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                          <span className="text-xs text-white/70 truncate">All of Me</span>
                        </div>
                        <span className="text-[10px] text-white/30 shrink-0 ml-2">G</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center animate-float">
                  <Mic2 size={28} className="text-white/60" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center animate-float" style={{ animationDelay: '1.5s' }}>
                  <ListMusic size={22} className="text-white/60" />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center mt-16 animate-bounce">
            <button onClick={scrollToFeatures} className="text-white/30 hover:text-white/60 transition-colors" aria-label="Scroll to features">
              <ChevronDown size={24} />
            </button>
          </div>
        </div>
      </section>

      <section id="stats" className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl sm:text-4xl font-display gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display mb-4">
              Semua yang <span className="gradient-text">Kamu Butuhkan</span>
            </h2>
            <p className="text-white/60 text-lg">Fitur lengkap untuk membantu player live musik bekerja lebih efisien dan profesional.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                  <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display mb-4">
                Siap <span className="gradient-text">Mencoba?</span>
              </h2>
              <p className="text-white/60 text-lg max-w-lg mx-auto mb-8">
                Mulai kelola live musik dengan lebih teratur. Gratis selamanya, tanpa ribet.
              </p>
              {user ? (
                <Link to="/app" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-neutral-900 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.97]">
                  <span>Buka Dashboard</span>
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-neutral-900 font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-[0.97]">
                  <span>Daftar Gratis</span>
                  <ArrowRight size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Music size={14} />
              <span>Reguleran Musik &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/30">
              <span>Dibuat untuk player & musisi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
