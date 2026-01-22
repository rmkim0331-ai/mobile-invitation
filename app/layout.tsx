import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // 웹브라우저 탭에 표시될 제목
  title: "타나베파마코리아 모바일 초청장",
  description: "행사에 여러분을 초대합니다.",
  
  // 카카오톡, 페이스북 등 공유 시 나타나는 메타데이터 (Open Graph)
  openGraph: {
    title: "타나베파마코리아 모바일 초청장",
    description: "행사에 여러분을 초대합니다.",
    
    // 카카오톡은 상대 경로(/og-image.png)보다 전체 주소를 적어줄 때 가장 확실하게 이미지를 불러옵니다.
    images: [
      {
        url: "https://mobile-invitation-tanabe-tau.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "타나베파마코리아 모바일 초청장 미리보기",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}