
import React, { useState, useEffect } from 'react';
import { CITIES } from './constants';
import { generateTravelItinerary } from './services/geminiService';
import { TravelItinerary } from './types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    kakao: '',
    phone: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateItinerary = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await generateTravelItinerary(searchQuery);
      setItinerary(data);
      setTimeout(() => {
        document.getElementById('itinerary-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      alert("꿈의 조각을 모으는 데 잠시 문제가 생겼어요. 다시 시도해볼까요?");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`${formData.name}님, 상담 신청이 성공적으로 전달되었습니다! ✨`);
      setFormData({ name: '', email: '', kakao: '', phone: '' });
    } catch (error) {
      alert("네트워크 연결이 불안정해요. 다시 시도해 주세요!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] selection:bg-rose-200 overflow-x-hidden font-nunito">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 py-3 md:px-6 md:py-4 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-yellow-100' : 'bg-transparent'}`}>
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={scrollToTop}
            className="text-xl md:text-2xl font-jua text-rose-500 flex items-center gap-2 cursor-pointer focus:outline-none active:scale-95 transition-transform"
          >
            <span className="text-2xl">🎨</span> 아름다운 여행
          </button>
          <a href="#contact-form" className="bg-rose-500 text-white px-4 py-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-all font-jua text-sm">
            상담
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center pt-16 pb-10 min-h-[70vh] justify-start">
        {/* Spline 3D Image Container - Reduced height (approx. half of previous) and shifted for face focus */}
        <div className="relative w-full h-[25vh] md:h-[35vh] overflow-hidden">
          <div className="absolute inset-0 transform scale-[2.2] translate-y-[35%]">
            <iframe 
              src='https://my.spline.design/interactivecharactergirl-MVNUAdogrsMEuxlLKVnsyyZB/' 
              frameBorder='0' 
              width='100%' 
              height='100%'
              title="Spline 3D Character"
              className="pointer-events-auto"
            ></iframe>
          </div>
        </div>

        {/* Hero Card */}
        <div className="w-full max-w-md px-6 z-10 -mt-2">
          <div className="bg-white/85 backdrop-blur-xl p-6 rounded-[2.5rem] border-[4px] border-white shadow-2xl animate-float text-center">
            <h1 className="text-3xl font-jua text-blue-600 leading-tight mb-2">
              당신의 <br />
              <span className="text-rose-500 underline decoration-yellow-300 decoration-wavy">유럽 이야기</span>
            </h1>
            <p className="text-lg font-gaegu font-bold text-gray-700 mb-5">
              지루한 계획 대신 설렘을 한 페이지 더
            </p>
            <div className="relative group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateItinerary()}
                placeholder="어디로 떠날까요? (예: 파리 3일)"
                className="w-full pl-5 pr-12 py-4 text-base rounded-full border-[3px] border-yellow-300 focus:border-rose-400 outline-none shadow-lg text-gray-800 placeholder-gray-400 font-gaegu transition-all"
              />
              <button 
                onClick={handleCreateItinerary}
                disabled={loading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-full transition-all shadow-md active:scale-90"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities - Compact Size */}
      <section id="cities" className="py-8 bg-white">
        <div className="px-6 max-w-md mx-auto">
          <div className="mb-5">
            <h2 className="text-xl font-jua text-amber-500">인기 도시 조각</h2>
            <div className="w-10 h-1 bg-rose-400 rounded-full mt-1"></div>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 snap-x pb-4">
          {CITIES.map((city) => (
            <div 
              key={city.id} 
              className="flex-shrink-0 w-[42vw] snap-start relative aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-md transition-transform active:scale-95"
            >
              <img 
                src={city.image} 
                alt={city.name} 
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <div className={`inline-block px-2 py-0.5 ${city.color} text-white font-jua rounded-full text-[7px] mb-1 uppercase tracking-widest`}>
                  {city.engName}
                </div>
                <h3 className="text-xl font-jua text-white mb-0.5">{city.name}</h3>
                <p className="text-white/80 font-gaegu text-xs line-clamp-1">{city.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Planner Result Section */}
      {itinerary && (
        <section id="itinerary-result" className="py-10 bg-amber-50 px-6">
          <div className="max-w-md mx-auto bg-white p-6 rounded-[2.5rem] border-[4px] border-yellow-200 shadow-xl relative">
            <h3 className="text-2xl font-jua text-blue-600 mb-6 text-center leading-tight">
              🎈 {itinerary.title}
            </h3>
            
            <div className="space-y-6 mb-8">
              {itinerary.days.map((d) => (
                <div key={d.day} className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-white font-jua text-lg shadow-md border-2 border-white">
                    {d.day}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-jua text-gray-800 mb-0.5">{d.activity}</h4>
                    <p className="text-sm font-gaegu text-gray-600 leading-relaxed">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 p-5 rounded-[1.5rem] border-2 border-emerald-100">
              <h4 className="text-base font-jua text-emerald-600 mb-3 flex items-center gap-2">
                <span className="text-xl">🎒</span> 여행 작가의 팁
              </h4>
              <ul className="space-y-2">
                {itinerary.tips.map((tip, idx) => (
                  <li key={idx} className="font-gaegu text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Checklist Grid */}
      <section id="checklist" className="py-12 px-6 bg-white">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-jua text-blue-600 mb-2">떠나기 전 체크!</h2>
            <p className="text-lg font-gaegu font-bold text-gray-400">설레는 시작을 위한 준비물</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {[
              { emoji: '🎫', title: 'ETIAS 허가', desc: '유럽 입국 필수 온라인 신청을 잊지 마세요.', color: 'bg-rose-50', border: 'border-rose-100' },
              { emoji: '🗓️', title: '90일 법칙', desc: '무비자 90일! 일정 계산이 가장 중요해요.', color: 'bg-amber-50', border: 'border-amber-100' },
              { emoji: '🚂', title: '교통편 예약', desc: '가까운 곳은 기차, 먼 곳은 저가 항공을!', color: 'bg-blue-50', border: 'border-blue-100' }
            ].map((item, i) => (
              <div key={i} className={`${item.color} p-6 rounded-[1.8rem] border-b-4 ${item.border} flex items-center gap-5 shadow-sm`}>
                <div className="text-3xl">{item.emoji}</div>
                <div>
                  <h4 className="text-lg font-jua text-gray-800 mb-0.5">{item.title}</h4>
                  <p className="font-gaegu text-sm text-gray-600 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="contact-form" className="py-12 bg-[#FFF9E6] px-6">
        <div className="max-w-md mx-auto bg-white p-7 rounded-[2.5rem] shadow-xl border-[4px] border-rose-100">
          <div className="text-center mb-7">
            <h2 className="text-2xl font-jua text-rose-500 mb-1.5">상담 신청</h2>
            <p className="text-lg font-gaegu font-bold text-gray-500">
              당신의 여행 작가가 기다려요.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input required type="text" placeholder="성함" className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-400 outline-none font-gaegu text-base bg-gray-50 shadow-inner" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input required type="tel" placeholder="연락처" className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-amber-400 outline-none font-gaegu text-base bg-gray-50 shadow-inner" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <input required type="email" placeholder="이메일 주소" className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-emerald-400 outline-none font-gaegu text-base bg-gray-50 shadow-inner" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="text" placeholder="카카오톡 ID (선택)" className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-rose-400 outline-none font-gaegu text-base bg-gray-50 shadow-inner" value={formData.kakao} onChange={(e) => setFormData({...formData, kakao: e.target.value})} />

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-4.5 text-white text-xl font-jua rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${submitting ? 'bg-gray-400' : 'bg-rose-500 hover:bg-rose-600'}`}
              >
                {submitting ? '전송 중...🕊️' : '여행 시작하기 ✨'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white text-center px-6">
        <div className="max-w-md mx-auto">
          <div className="text-2xl font-jua text-rose-500 mb-3">아름다운 여행</div>
          <p className="font-gaegu text-base text-gray-400 mb-8 leading-relaxed px-4">
            모든 골목이 당신의 무대가 되고,<br /> 모든 순간이 반짝이는 추억이 되길.
          </p>
          <div className="flex justify-center gap-4 mb-10">
            {['📷', '💬', '📍'].map((icon, i) => (
              <div key={i} className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-500 transition-all text-lg">
                {icon}
              </div>
            ))}
          </div>
          <div className="text-gray-500 font-gaegu text-xs border-t border-white/10 pt-8">
            © 2026 아름다운 여행 · Have a Safe Trip!
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={scrollToTop}
          className="w-14 h-14 bg-yellow-400 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform border-[4px] border-white"
        >
          <span className="text-2xl">👆</span>
        </button>
      </div>
    </div>
  );
};

export default App;
