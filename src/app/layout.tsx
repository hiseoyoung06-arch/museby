import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "뮤즈바이 댓글이벤트",
  description: "브랜드 댓글이벤트 당첨자 정보 수집 어시스턴트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
