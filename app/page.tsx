"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { MapPin, Phone, Mail, Calendar, User, ChevronRight, Info, Clock, ExternalLink } from 'lucide-react';

export default function InvitationPage() {
  const [data, setData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const agendaRef = useRef<HTMLDivElement>(null);
  const totalPages = 5;

  // 1. invite.json 데이터 로드 (캐시 방지 및 5P 이미지 데이터 강제 동기화)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/invite.json?t=${new Date().getTime()}`);
        const json = await response.json();
        console.log("Invitation Data Loaded:", json);
        setData(json);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };
    fetchData();
  }, []);

  // 2. 메인 페이지 스와이프 핸들러 (부드러운 전환 효과 유지)
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
        <p className="animate-pulse text-purple-600 font-bold tracking-widest text-[13px]">LOADING SYMPOSIUM</p>
      </div>
    </div>
  );

  const { meta = {}, invitation = {}, agenda = [], location = {}, gallery = {} } = data;

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden font-sans select-none">
      {/* 바다넴 브랜드 이미지: 은은한 퍼플 배경 장식 */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

      <main {...mainHandlers} className="relative w-full h-full flex flex-col z-10 bg-transparent">
        
        {/* 상단 인디케이터 (퍼플 포인트) */}
        <div className="absolute top-10 left-0 right-0 z-50 flex justify-center gap-3">
          {[...Array(totalPages)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-700 ease-in-out ${i === currentPage ? 'w-12 bg-purple-900 shadow-lg' : 'w-2.5 bg-purple-100'}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage} 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -50 }} 
            transition={{ duration: 0.5, ease: "circOut" }}
            className="h-full w-full flex flex-col pt-24 pb-10"
          >
            
            {/* 1P: 메인 섹션 - 한 줄 정렬 최적화 */}
            {currentPage === 0 && (
              <div className="h-full flex flex-col px-8 text-center justify-between">
                <div className="pt-6">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-purple-600 font-black tracking-[0.2em] text-[12px] uppercase mb-4 block">Official Invitation</motion.span>
                  <h2 className="text-slate-900 text-[32px] font-black mb-10 leading-[1.2] break-keep">{meta.title}</h2>
                  
                  <div className="bg-white/95 backdrop-blur-md rounded-[3rem] p-10 flex flex-col gap-10 border border-purple-50 shadow-2xl shadow-purple-100/30 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-purple-600" />
                    
                    {/* 날짜: 한 줄 최적화 [요청 해결] */}
                    <div className="flex items-center gap-6 text-left">
                      <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm shrink-0"><Calendar size={28}/></div>
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Date & Time</span>
                        <p className="text-slate-900 font-black text-[18px] leading-tight whitespace-nowrap">{meta.datetime}</p>
                      </div>
                    </div>
                    
                    {/* 장소: 한 줄 최적화 [요청 해결] */}
                    <div className="flex items-center gap-6 text-left">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-purple-800 shadow-sm shrink-0"><MapPin size={28}/></div>
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Venue</span>
                        <p className="text-slate-900 font-black text-[17px] leading-tight whitespace-nowrap">{meta.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-slate-400 font-bold italic animate-pulse flex items-center gap-2 text-[15px]">
                    Swipe Left to Open <ChevronRight size={20} className="text-purple-500"/>
                  </p>
                </div>
              </div>
            )}

            {/* 2P: 초대의 글 - 스크롤바 우측 고정 */}
            {currentPage === 1 && (
              <div className="h-full flex flex-col">
                <div className="px-10 mb-6">
                  <h2 className="text-slate-900 text-[28px] font-black mb-2 tracking-tight">초대의 글</h2>
                  <div className="h-1 w-16 bg-purple-600 rounded-full" />
                </div>
                <div className="flex-1 overflow-y-auto px-10 custom-scrollbar">
                  <div className="italic text-[18px] leading-[2.4] text-slate-700 whitespace-pre-wrap font-medium pb-10">
                    {invitation.message}
                  </div>
                </div>
              </div>
            )}

            {/* 3P: 아젠다 - 글자 크기 축소 및 가독성 개선 [요청 해결] */}
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
                            <span className="bg-purple-900 text-white text-[11px] font-black px-5 py-2 rounded-xl uppercase tracking-widest shadow-md">
                              {day.day_label}
                            </span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-100 to-transparent" />
                          </div>
                          
                          <div className="space-y-10 pl-1 border-l border-purple-50">
                            {day.items.map((item: any, i: number) => (
                              <div key={i} className="flex gap-5 items-start">
                                <div className="shrink-0 pt-1">
                                  <span className="bg-white border border-purple-100 text-slate-400 text-[10px] font-black px-2.5 py-1.5 rounded-lg">
                                    {item.time}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  {/* 제목 폰트 크기 조정: text-[16px] */}
                                  <h4 className="text-[16px] font-black text-slate-900 leading-[1.4] mb-2 whitespace-normal break-keep">
                                    {item.title}
                                  </h4>
                                  {item.speaker && (
                                    <div className="flex items-start gap-2 text-purple-600 font-bold italic text-[14px]">
                                      <User size={14} className="mt-0.5 shrink-0 opacity-70"/>
                                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                                        {/* 좌장/소속 줄바꿈 없이 나열되도록 개선 */}
                                        {item.speaker.split(',').map((name: string, nIdx: number) => (
                                          <span key={nIdx} className="whitespace-nowrap leading-tight">{name.trim()}</span>
                                        ))}
                                      </div>
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
                <div className="mx-8 mt-4 bg-purple-900 py-5 rounded-[2.5rem] text-center shadow-xl">
                  <p className="text-white text-[13px] font-bold flex items-center justify-center gap-2">
                    <Clock size={16} className="text-purple-300"/> 스크롤하여 전체 일정을 확인하세요
                  </p>
                </div>
              </div>
            )}

            {/* 4P: 오시는 길 - 컴팩트 디자인으로 하단 짤림 방지 [요청 해결] */}
            {currentPage === 3 && (
              <div className="h-full flex flex-col px-10 justify-between">
                <div>
                  <h2 className="text-slate-900 text-[28px] font-black mb-8 tracking-tight">오시는 길</h2>
                  <div className="flex flex-col gap-6 text-center">
                    <div className="w-20 h-20 bg-purple-900 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-xl transform rotate-3">
                      <MapPin size={40}/>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[22px] font-black text-slate-900 leading-snug break-keep">{location.address}</p>
                      <div className="h-1 w-10 bg-purple-100 mx-auto rounded-full" />
                    </div>
                    <button 
                      onClick={() => window.open(location.naver_map_url, '_blank')} 
                      className="w-full bg-purple-600 text-white py-5 rounded-[2.5rem] font-black text-[18px] shadow-2xl shadow-purple-200 active:scale-95 transition-all"
                    >
                      네이버 지도 앱 실행
                    </button>
                  </div>
                </div>

                {/* 문의처: 여백 및 크기 축소로 화면 짤림 방지 */}
                <div className="p-8 bg-purple-50/80 rounded-[3rem] border border-purple-100 space-y-4 text-left font-bold relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-purple-900"><Info size={48}/></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <Phone size={18} className="text-purple-400"/>
                    <p className="text-slate-900 text-[16px]">{location.contact_name} : {location.contact_phone}</p>
                  </div>
                  {location.contact_email && (
                    <div className="flex items-center gap-4 relative z-10">
                      <Mail size={18} className="text-purple-400"/>
                      <p className="text-slate-900 text-[16px]">{location.contact_email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5P: 기타 안내 - info.png 적용 및 최종 레이아웃 [요청 해결] */}
            {currentPage === 4 && (
              <div className="h-full flex flex-col px-10">
                <div className="mb-8">
                  <h2 className="text-slate-900 text-[28px] font-black mb-2 border-b-4 border-purple-900 w-fit pb-1">기타 안내</h2>
                </div>
                
                {/* 컨텐츠 영역: 이미지 노출 로직 강화 */}
                <div className="flex-1 flex flex-col gap-10 overflow-y-auto items-center pt-2 pb-6 custom-scrollbar">
                  
                  {/* 안내 이미지 (info.png) - 데이터가 로드된 후 강제 표시 */}
                  {gallery?.image_file && gallery.image_file !== "" ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="w-full shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-purple-50 relative z-20"
                    >
                      <img 
                        src={`/${gallery.image_file}`} 
                        alt="Info Banner" 
                        className="w-full h-auto object-cover block mx-auto"
                        onLoad={() => console.log("Info image successfully rendered")}
                        onError={(e) => {
                          console.log("Retrying image load with absolute path...");
                          e.currentTarget.src = "/info.png";
                        }}
                      />
                    </motion.div>
                  ) : (
                    /* 데이터가 안 넘어왔을 경우를 대비한 하드코딩 백업 로직 */
                    <div className="w-full shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-purple-50">
                      <img src="/info.png" alt="Info Banner Backup" className="w-full h-auto block" />
                    </div>
                  )}

                  {/* 감사 인사 멘트: 퍼플 포인트 강조 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full p-10 bg-slate-900 rounded-[3.5rem] text-white shadow-2xl shadow-purple-100 text-center relative overflow-hidden mt-auto shrink-0 mb-2"
                  >
                    <div className="absolute top-[-30%] left-[-20%] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                    <p className="font-black italic text-[18px] leading-[1.6] break-keep relative z-10 tracking-tight">
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

      {/* 커스텀 스크롤바 스타일링: 퍼플 테마 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}