# 뮤즈바이 댓글이벤트 진행 어시스턴트

브랜드가 댓글 이벤트 당첨자 정보 수집 폼을 만들고, 인플루언서가 폼을 통해 정보를 제출하고,
뮤즈바이 관리자가 전체 현황을 확인하는 3-역할 서비스입니다.

## 역할별 화면

- **브랜드** (`/`): 뮤즈바이가 발급한 코드를 입력해 입장 (별도 계정 없음)
  - `/brand/dashboard`: 내가 만든 댓글 이벤트 목록
  - `/brand/events/new`: 캠페인명 / 당첨 상품 / 당첨 명수 / 최종 업로드 예정일 / 정보 수집 방식(이메일 또는 배송지) / 주의사항을 입력해 이벤트 생성
  - `/brand/events/[id]`: 생성된 폼 링크 확인·복사, 이벤트 정보 수정, 제출된 당첨자 목록 조회, 당첨 상품 전달 여부 체크
- **인플루언서** (`/f/[slug]`): 전달받은 링크로 접속해 채널명/성함/연락처/이메일 또는 배송지+우편번호를 입력하고 개인정보 수집 동의 후 제출
- **뮤즈바이 관리자** (`/admin/login`): 공용 비밀번호(`ADMIN_PASSWORD`)만 입력하면 로그인 (개별 계정 없음)
  - `/admin/dashboard`: 모든 브랜드의 댓글 이벤트 목록
  - `/admin/events/[id]`: 제출된 정보 조회, 전달 여부 체크, 당첨자 정보 수정, 이벤트 정보 수정
  - `/admin/brands`: 브랜드 코드 등록(자동생성 포함)·목록 조회·삭제 (브랜드를 삭제하면 그 브랜드의 댓글이벤트와 제출 정보도 함께 삭제됩니다)

## 기술 스택

- Next.js 14 (App Router, Server Actions) + TypeScript + Tailwind CSS
- Supabase (Postgres) — 서버 액션에서 서비스 롤 키로만 데이터에 접근하고,
  모든 테이블은 RLS를 켜둔 채 정책을 두지 않아 클라이언트가 직접 접근할 수 없습니다.
- 브랜드/관리자 로그인 모두 계정 시스템 없이 HMAC 서명된 쿠키 세션만 사용합니다
  (Supabase Auth 미사용).

## 로컬 설정

1. Supabase 프로젝트를 생성합니다.
2. `supabase/migrations/0001_init.sql` 을 Supabase SQL Editor에서 실행합니다.
   (선택) 테스트용 브랜드 코드가 필요하면 `supabase/seed.sql` 도 실행하세요.
3. `.env.example` 을 `.env.local` 로 복사하고 값을 채웁니다.
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 는 Supabase 프로젝트 설정 > API 에서 확인
   - `BRAND_SESSION_SECRET` 은 `openssl rand -hex 32` 등으로 생성한 임의의 긴 문자열
   - `ADMIN_PASSWORD` 는 뮤즈바이 관리자 로그인에 쓸 공용 비밀번호
4. 의존성 설치 후 개발 서버 실행

   ```bash
   npm install
   npm run dev
   ```

## 알려진 제한 사항 (MVP 범위)

- `next@14.2.35`를 사용합니다. `npm audit`에 남아있는 Next.js 관련 항목들은
  이미지 최적화, i18n 미들웨어, WebSocket 업그레이드 등 이 프로젝트가 쓰지 않는
  기능에 대한 것들이며, 모두 Next 16에서만 완전히 해결됩니다(App Router의
  `cookies()`/`params`가 비동기로 바뀌는 큰 변경이 필요해 이번 MVP 범위에서는
  보류했습니다).
- 관리자 로그인은 개인별 계정이 아니라 공용 비밀번호 하나만 확인합니다.
  누가 로그인했는지 감사 로그가 필요하거나 인원별로 접근을 차단해야 한다면
  이후 Supabase Auth 등 개별 계정 체계로 교체가 필요합니다.
- 최종 업로드 예정일 + 7일 마감 문구는 서버 로컬 시간대 기준 달력 날짜로 계산합니다.
