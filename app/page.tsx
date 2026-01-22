"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { MapPin, Phone, Mail, FileText, Calendar, User, ChevronRight, X, Info, Clock } from 'lucide-react';

export default function InvitationPage() {
  const [data, setData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const agendaRef = useRef<HTMLDivElement>(null);
  const totalPages = 5;

  // 1. invite.json 데이터 로드 (캐시 방지 쿼리 및 로그 확인 포함)
  useEffect(() => {
    fetch(`/invite.json?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(json => {
        console.log("Data loaded successfully:", json);
        setData(json);
      })
      .catch(err => console.error("데이터 로드 실패:", err));
  }, []);

  // 2. 메인 페이지 스와이프 핸들러 (전체 페이지 이동)
  const mainHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1)),
    onSwipedRight: () => setCurrentPage(prev => Math.max(prev - 1, 0)),
    trackMouse: true,
    preventScrollOnSwipe: true
  });

  if (!data) return (
    <div className="flex h-screen items-center justify-center bg-white font-bold text-slate-400">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse text-blue-600 tracking-widest text-[14px]">LOADING INFORMATION</p>
      </div>
    </div>
  );

  const { meta = {}, invitation = {}, agenda = [], location = {}, gallery = {} } = data;

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden font-sans select-none">
      {/* 배경 장식 레이어: 심미성을 극대화합니다. */}
      <div className="absolute top-[-8%] right-[-8%] w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-8%] left-[-8%] w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <main {...mainHandlers} className="relative w-full h-full flex flex-col z-10 bg-transparent">
        
        {/* 상단 페이지 인디케이터 (고급 디자인 적용) */}
        <div className="absolute top-12 left-0 right-0 z-50 flex justify-center gap-3">
          {[...Array(totalPages)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-700 ease-in-out ${i === currentPage ? 'w-14 bg-slate-900 shadow-lg shadow-slate-200' : 'w-2.5 bg-slate-200'}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage} 
            initial={{ opacity: 0, x: 40 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -40 }} 
            transition={{ duration: 0.5, ease: "circOut" }}
            className="h-full w-full flex flex-col pt-28 pb-14"
          >
            
            {/* 1P: 메인 섹션 - 사용자님이 완성하신 레이아웃을 그대로 유지합니다. */}
            {currentPage === 0 && (
              <div className="h-full flex flex-col px-10 text-center justify-between">
                <div className="pt-10">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-600 font-black tracking-[0.2em] text-[13px] uppercase mb-5 block">Invitation</motion.span>
                  <h2 className="text-slate-900 text-[36px] font-black mb-14 leading-[1.2] break-keep">{meta.title}</h2>
                  
                  <div className="bg-white/95 backdrop-blur-md rounded-[3.8rem] p-12 flex flex-col gap-14 border border-blue-50 shadow-2xl shadow-blue-100/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-blue-600" />
                    <div className="flex items-center gap-7 text-left">
                      <div className="w-16 h-16 bg-blue-50 rounded-[1.6rem] flex items-center justify-center text-blue-600 shadow-sm shrink-0"><Calendar size={32}/></div>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Date & Time</span>
                        <p className="text-slate-900 font-black text-[21px] leading-tight">{meta.datetime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-7 text-left">
                      <div className="w-16 h-16 bg-slate-50 rounded-[1.6rem] flex items-center justify-center text-slate-600 shadow-sm shrink-0"><MapPin size={32}/></div>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Venue</span>
                        <p className="text-slate-900 font-black text-[21px] leading-tight break-keep">{meta.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-slate-400 font-bold italic animate-bounce flex items-center gap-2.5 text-[17px]">
                    Swipe Left to Explore <ChevronRight size={22} className="text-blue-500"/>
                  </p>
                </div>
              </div>
            )}

            {/* 2P: 초대의 글 - 스크롤바 우측 정렬 완벽 상태 유지 */}
            {currentPage === 1 && (
              <div className="h-full flex flex-col">
                <div className="px-12 mb-10">
                  <h2 className="text-slate-900 text-[30px] font-black mb-3 tracking-tight">초대의 글</h2>
                  <div className="h-1.5 w-20 bg-blue-600 rounded-full" />
                </div>
                <div className="flex-1 overflow-y-auto px-12 custom-scrollbar">
                  <div className="italic text-[20px] leading-[2.5] text-slate-700 whitespace-pre-wrap font-medium pb-12">
                    {invitation.message}
                  </div>
                </div>
              </div>
            )}

            {/* 3P: 아젠다 - 줄바꿈 및 왼쪽 밀착 정렬 완벽 상태 유지 */}
            {currentPage === 2 && (
              <div className="h-full flex flex-col">
                <div className="px-8 mb-8">
                  <h2 className="text-slate-900 text-[30px] font-black mb-1">아젠다</h2>
                  <p className="text-slate-400 font-bold text-[14px] tracking-wide">Symposium Program Details</p>
                </div>
                
                <div className="flex-1 overflow-hidden" onPointerDown={(e) => e.stopPropagation()}>
                  <div ref={agendaRef} className="h-full overflow-y-auto px-8 custom-scrollbar scroll-smooth">
                    <div className="space-y-16 py-8">
                      {agenda.map((day: any, idx: number) => (
                        <div key={idx} className="relative">
                          <div className="flex items-center gap-5 mb-12">
                            <span className="bg-slate-900 text-white text-[13px] font-black px-6 py-3 rounded-2xl uppercase tracking-widest shadow-xl">
                              {day.day_label}
                            </span>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-100 to-transparent" />
                          </div>
                          
                          <div className="space-y-14 pl-2 border-l-2 border-slate-50">
                            {day.items.map((item: any, i: number) => (
                              <div key={i} className="flex gap-7 items-start group">
                                <div className="shrink-0 pt-1.5">
                                  <span className="bg-white border-2 border-slate-100 text-slate-400 text-[12px] font-black px-3.5 py-2 rounded-xl group-hover:border-blue-500 group-hover:text-blue-600 transition-all duration-300">
                                    {item.time}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-[19px] font-black text-slate-900 leading-[1.5] mb-4 whitespace-normal break-keep group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                  </h4>
                                  {item.speaker && (
                                    <div className="flex items-start gap-2.5 text-blue-500 font-bold italic text-[16px]">
                                      <User size={16} className="mt-1 shrink-0 opacity-70"/>
                                      <div className="flex flex-col gap-2">
                                        {item.speaker.split(',').map((name: string, nIdx: number) => (
                                          <span key={nIdx} className="block leading-tight">{name.trim()}</span>
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
                <div className="mx-10 mt-8 bg-slate-900 py-6 rounded-[2.8rem] text-center shadow-2xl active:scale-95 transition-transform duration-300">
                  <p className="text-white text-[15px] font-black flex items-center justify-center gap-3">
                    <Clock size={18} className="text-blue-400 animate-pulse"/> 스크롤하여 전체 일정을 확인하세요
                  </p>
                </div>
              </div>
            )}

            {/* 4P: 오시는 길 - 카드 디자인 유지 */}
            {currentPage === 3 && (
              <div className="h-full flex flex-col px-12">
                <h2 className="text-slate-900 text-[30px] font-black mb-12 tracking-tight">오시는 길</h2>
                <div className="flex-1 flex flex-col gap-12 text-center pt-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="w-26 h-26 bg-slate-900 rounded-[3.5rem] flex items-center justify-center text-white mx-auto shadow-2xl transform rotate-2">
                    <MapPin size={48}/>
                  </motion.div>
                  <div className="space-y-4">
                    <p className="text-[26px] font-black text-slate-900 leading-snug break-keep">{location.address}</p>
                    <div className="h-1.5 w-14 bg-blue-100 mx-auto rounded-full" />
                  </div>
                  <button 
                    onClick={() => window.open(location.naver_map_url, '_blank')} 
                    className="w-full bg-blue-600 text-white py-8 rounded-[2.8rem] font-black text-[22px] shadow-2xl shadow-blue-200 active:scale-95 transition-all duration-300"
                  >
                    네이버 지도 앱 실행
                  </button>
                  <div className="mt-auto p-12 bg-slate-50/90 rounded-[4rem] border border-slate-100 space-y-6 text-left font-bold relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 p-5 opacity-5"><Info size={60}/></div>
                    <div className="flex items-center gap-5 relative z-10">
                      <Phone size={22} className="text-slate-400"/>
                      <p className="text-slate-900 text-[19px]">{location.contact_name} : {location.contact_phone}</p>
                    </div>
                    {location.contact_email && (
                      <div className="flex items-center gap-5 relative z-10">
                        <Mail size={22} className="text-slate-400"/>
                        <p className="text-slate-900 text-[19px]">{location.contact_email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5P: 기타 안내 - [최종 수정] 이미지 즉시 노출 및 레이아웃 완성 */}
            {currentPage === 4 && (
              <div className="h-full flex flex-col px-10">
                <div className="mb-10">
                  <h2 className="text-slate-900 text-[30px] font-black mb-3 border-b-4 border-slate-900 w-fit pb-2">기타 안내</h2>
                </div>
                
                {/* 5페이지 메인 컨텐츠 영역: 이미지와 멘트가 겹치지 않게 정렬합니다. */}
                <div className="flex-1 flex flex-col gap-12 overflow-y-auto items-center custom-scrollbar pt-2 pb-6">
                  
                  {/* 1. 상단 안내 이미지 (info.png) */}
                  {/* gallery.image_file 데이터가 존재할 때만 표시하며, 애니메이션 효과를 부여합니다. */}
                  {gallery?.image_file && gallery.image_file !== "" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="w-full shrink-0 rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-20"
                    >
                      <img 
                        src={`/${gallery.image_file}`} 
                        alt="Supplement Information" 
                        className="w-full h-auto object-cover block mx-auto"
                        onLoad={() => console.log("Info image rendered successfully")}
                        onError={(e) => {
                          console.error("Image load failed, attempting fallback");
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </motion.div>
                  )}

                  {/* 2. 감사 인사 멘트 (이미지 하단 고정 및 시각적 강조) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full p-12 bg-slate-900 rounded-[3.8rem] text-white shadow-2xl shadow-slate-300 text-center relative overflow-hidden mt-auto shrink-0 mb-4"
                  >
                    <div className="absolute top-[-30%] left-[-20%] w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <p className="font-black italic text-[20px] leading-[1.6] break-keep relative z-10 tracking-tight">
                      심포지엄에 관심을 가져주셔서 <br/> 
                      <span className="text-blue-400">대단히 감사합니다.</span>
                    </p>
                  </motion.div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}