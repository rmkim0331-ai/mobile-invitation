"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { MapPin, Phone, Mail, Calendar, User, ChevronRight, Clock } from 'lucide-react';

export default function InvitationPage() {
  const [data, setData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const agendaRef = useRef<HTMLDivElement>(null);
  const totalPages = 5;

  // 1. invite.json 데이터 로드 (실시간 반영을 위한 캐시 방지 로직)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/invite.json?t=${new Date().getTime()}`);
        const json = await response.json();
        console.log("VADANEM Invitation Data Loaded:", json);
        setData(json);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };
    fetchData();
  }, []);

  // 2. 메인 페이지 수평 스와이프 핸들러 (부드러운 페이지 전환)
  const mainHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1)),
    onSwipedRight: () => setCurrentPage(prev => Math.max(prev - 1, 0)),
    trackMouse: true,
    preventScrollOnSwipe: true
  });

  if (!data) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse text-purple-600 font-black tracking-widest text-[13px]">VADANEM SYMPOSIUM</p>
      </div>
    </div>
  );

  const { meta = {}, invitation = {}, agenda = [], location = {}, gallery = {} } = data;

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden font-sans select-none">
      {/* 브랜드 아이덴티티: 은은한 퍼플 배경 장식 레이어 */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <main {...mainHandlers} className="relative w-full h-full flex flex-col z-10 bg-transparent">
        
        {/* 상단 페이지 인디케이터 (디자인 포인트) */}
        <div className="absolute top-10 left-0 right-0 z-50 flex justify-center gap-3">
          {[...Array(totalPages)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${i === currentPage ? 'w-12 bg-purple-900 shadow-lg shadow-purple-200' : 'w-2.5 bg-purple-100'}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage} 
            initial={{ opacity: 0, x: 60 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -60 }} 
            transition={{ duration: 0.5, ease: "circOut" }}
            className="h-full w-full flex flex-col pt-24 pb-10"
          >
            
            {/* 1P: 메인 섹션 - [수정] 텍스트 잘림 해결을 위한 정밀 조정 */}
            {currentPage === 0 && (
              <div className="h-full flex flex-col px-8 text-center justify-between">
                <div className="pt-6">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-600 font-black tracking-[0.25em] text-[12px] uppercase mb-5 block">Official Invitation</motion.span>
                  <h2 className="text-slate-900 text-[32px] font-black mb-10 leading-[1.2] break-keep tracking-tight">{meta.title}</h2>
                  
                  {/* 박스 여백과 아이콘 간격을 재조정하여 텍스트 공간 확보 */}
                  <div className="bg-white/95 backdrop-blur-md rounded-[3rem] px-5 py-11 flex flex-col gap-11 border border-purple-50 shadow-2xl shadow-purple-100/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-purple-600" />
                    
                    {/* 날짜 섹션: 텍스트 크기 17px로 축소 및 자간 조정 */}
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm shrink-0"><Calendar size={28}/></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Date & Time</span>
                        <p className="text-slate-900 font-black text-[17px] leading-tight whitespace-nowrap tracking-tighter">
                          {meta.datetime}
                        </p>
                      </div>
                    </div>
                    
                    {/* 장소 섹션: 텍스트 크기 17px로 조정 */}
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-purple-800 shadow-sm shrink-0"><MapPin size={28}/></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Venue</span>
                        <p className="text-slate-900 font-black text-[17px] leading-tight whitespace-nowrap tracking-tighter">
                          {meta.venue}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-slate-400 font-bold italic animate-pulse flex items-center gap-2 text-[15px]">
                    Swipe Left to Start <ChevronRight size={20} className="text-purple-500"/>
                  </p>
                </div>
              </div>
            )}

            {/* 2P: 초대의 글 - 스크롤바 우측 벽면 밀착 완료 */}
            {currentPage === 1 && (
              <div className="h-full flex flex-col">
                <div className="px-10 mb-8">
                  <h2 className="text-slate-900 text-[28px] font-black mb-2 tracking-tight">초대의 글</h2>
                  <div className="h-1 w-16 bg-purple-600 rounded-full" />
                </div>
                <div className="flex-1 overflow-y-auto px-10 custom-scrollbar">
                  <div className="italic text-[18px] leading-[2.4] text-slate-700 whitespace-pre-wrap font-medium pb-12">
                    {invitation.message}
                  </div>
                </div>
              </div>
            )}

            {/* 3P: 아젠다 - 가독성 중심의 컴팩트 레이아웃 */}
            {currentPage === 2 && (
              <div className="h-full flex flex-col">
                <div className="px-6 mb-6">
                  <h2 className="text-slate-900 text-[28px] font-black mb-1">아젠다</h2>
                  <p className="text-slate-400 font-bold text-[12px] tracking-wide uppercase">Symposium Schedule</p>
                </div>
                
                <div className="flex-1 overflow-hidden" onPointerDown={(e) => e.stopPropagation()}>
                  <div ref={agendaRef} className="h-full overflow-y-auto px-6 custom-scrollbar scroll-smooth">
                    <div className="space-y-12 py-4">
                      {agenda.map((day: any, idx: number) => (
                        <div key={idx} className="relative">
                          <div className="flex items-center gap-4 mb-8">
                            <span className="bg-purple-900 text-white text-[11px] font-black px-5 py-2 rounded-xl uppercase tracking-widest shadow-md">{day.day_label}</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-100 to-transparent" />
                          </div>
                          <div className="space-y-10 pl-1 border-l border-purple-50">
                            {day.items.map((item: any, i: number) => (
                              <div key={i} className="flex gap-5 items-start">
                                <div className="shrink-0 pt-1"><span className="bg-white border border-purple-100 text-slate-400 text-[10px] font-black px-2.5 py-1.5 rounded-lg">{item.time}</span></div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[16px] font-black text-slate-900 leading-[1.4] mb-2 whitespace-normal break-keep">{item.title}</h4>
                                  {item.speaker && (
                                    <div className="flex items-start gap-2 text-purple-600 font-bold italic text-[14px]">
                                      <User size={14} className="mt-0.5 shrink-0 opacity-70"/>
                                      <div className="flex flex-wrap gap-x-3 gap-y-1">{item.speaker.split(',').map((name: string, nIdx: number) => (<span key={nIdx} className="whitespace-nowrap leading-tight">{name.trim()}</span>))}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mx-8 mt-5 bg-purple-900 py-5 rounded-[2.5rem] text-center shadow-xl">
                  <p className="text-white text-[13px] font-bold flex items-center justify-center gap-2">
                    <Clock size={16} className="text-purple-300"/> 스크롤하여 전체 일정을 확인하세요
                  </p>
                </div>
              </div>
            )}

            {/* 4P: 오시는 길 - [수정] 느낌표 아이콘 제거 및 컴팩트 디자인 */}
            {currentPage === 3 && (
              <div className="h-full flex flex-col px-10 justify-between">
                <div>
                  <h2 className="text-slate-900 text-[28px] font-black mb-10 tracking-tight">오시는 길</h2>
                  <div className="flex flex-col gap-8 text-center pt-2">
                    <motion.div whileHover={{ scale: 1.05 }} className="w-22 h-22 bg-purple-900 rounded-[2.8rem] flex items-center justify-center text-white mx-auto shadow-2xl transform rotate-3">
                      <MapPin size={42}/>
                    </motion.div>
                    <div className="space-y-3">
                      <p className="text-[23px] font-black text-slate-900 leading-snug break-keep">{location.address}</p>
                      <div className="h-1.5 w-12 bg-purple-100 mx-auto rounded-full" />
                    </div>
                    <button 
                      onClick={() => window.open(location.naver_map_url, '_blank')} 
                      className="w-full bg-purple-600 text-white py-6 rounded-[2.5rem] font-black text-[19px] shadow-2xl shadow-purple-200 active:scale-95 transition-all"
                    >
                      네이버 지도 앱 실행
                    </button>
                  </div>
                </div>

                {/* 하단 담당자 정보: 느낌표 아이콘 제거 완료 */}
                <div className="p-9 bg-purple-50/80 rounded-[3.5rem] border border-purple-100 space-y-5 text-left font-bold relative overflow-hidden shadow-sm mb-2">
                  <div className="flex items-center gap-5 relative z-10">
                    <Phone size={20} className="text-purple-400"/>
                    <p className="text-slate-900 text-[17px]">{location.contact_name} : {location.contact_phone}</p>
                  </div>
                  {location.contact_email && (
                    <div className="flex items-center gap-5 relative z-10">
                      <Mail size={20} className="text-purple-400"/>
                      <p className="text-slate-900 text-[17px]">{location.contact_email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5P: 기타 안내 - [수정] 스크롤바 위치 화면 끝으로 이동 완료 */}
            {currentPage === 4 && (
              <div className="h-full flex flex-col">
                <div className="mb-8 px-10">
                  <h2 className="text-slate-900 text-[28px] font-black mb-2 border-b-4 border-purple-900 w-fit pb-1">기타 안내</h2>
                </div>
                
                {/* 패딩 구조를 변경하여 스크롤바가 화면 우측 벽에 붙도록 함 */}
                <div className="flex-1 flex flex-col gap-10 overflow-y-auto items-center pt-2 pb-8 custom-scrollbar px-10">
                  
                  {/* 안내 이미지: 로딩 에러 방지 및 강제 렌더링 로직 */}
                  {gallery?.image_file && gallery.image_file !== "없음" ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.96 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="w-full shrink-0 rounded-[3rem] overflow-hidden shadow-2xl border-2 border-purple-50 relative z-20"
                    >
                      <img 
                        src={`/${gallery.image_file}`} 
                        alt="Supplement Banner" 
                        className="w-full h-auto object-cover block mx-auto"
                        onLoad={() => console.log("Banner image loaded")}
                        onError={(e) => { e.currentTarget.src = "/info.png"; }}
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full shrink-0 rounded-[3rem] overflow-hidden shadow-2xl border-2 border-purple-50">
                      <img src="/info.png" alt="Fallback Banner" className="w-full h-auto block" />
                    </div>
                  )}

                  {/* 감사 인사 멘트: 퍼플 포인트와 심플한 정렬 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full p-11 bg-slate-900 rounded-[3.8rem] text-white shadow-2xl shadow-purple-100/50 text-center relative overflow-hidden mt-auto shrink-0 mb-4"
                  >
                    <div className="absolute top-[-30%] left-[-20%] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                    <p className="font-black italic text-[19px] leading-[1.7] break-keep relative z-10 tracking-tight">
                      심포지엄에 관심을 가져주셔서 <br/> 
                      <span className="text-purple-400">대단히 감사합니다.</span>
                    </p>
                  </motion.div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 전역 스타일: 브랜드 퍼플 컬러 커스텀 스크롤바 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.25); border-radius: 20px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(147, 51, 234, 0.25) transparent; }
      `}</style>
    </div>
  );
}