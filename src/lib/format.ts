import { nanoid, customAlphabet } from "nanoid";

const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

// Excludes visually ambiguous characters (I, O, 0, 1).
const generateBrandCodeSuffix = customAlphabet(
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
  6
);

export function generateFormSlug() {
  return nanoid(10);
}

export function generateBrandCode() {
  return `MUSEBY-${generateBrandCodeSuffix()}`;
}

/** final_upload_date(YYYY-MM-DD) + 7일 자정 마감(23:59)의 Date를 반환. */
export function getSubmissionDeadline(finalUploadDate: string): Date {
  const [year, month, day] = finalUploadDate.split("-").map(Number);
  // Interpreted as a calendar date, not a specific timezone instant.
  return new Date(year, month - 1, day + 7);
}

export function formatDeadlineKorean(finalUploadDate: string): string {
  const deadline = getSubmissionDeadline(finalUploadDate);
  const month = deadline.getMonth() + 1;
  const day = deadline.getDate();
  const weekday = WEEKDAYS_KO[deadline.getDay()];
  return `${month}월 ${day}일(${weekday})`;
}

export function buildEventTitle(campaignName: string): string {
  return `${campaignName} 댓글이벤트`;
}

export function buildEventDescription(
  campaignName: string,
  finalUploadDate: string
): string {
  const deadline = formatDeadlineKorean(finalUploadDate);
  return `${campaignName} 댓글 이벤트 당첨을 진심으로 축하드려요! 🎉

${deadline} 밤 11시 59분까지 아래 링크를 통해 배송지 정보를 입력해 주세요.
기한 내 정보를 입력해주신 분께는 선물🎁을 순차적으로 발송해 드릴 예정입니다.

※ 기한 이후에는 발송이 어려운 점 양해 부탁드립니다.`;
}

export const PERSONAL_INFO_CONSENT_TEXT = `[개인정보 수집 및 이용 동의서]
수집 항목: 이름, 연락처, 주소
수집 목적: 이벤트 경품 발송을 위한 수취인 정보 확인
보유 및 이용 기간: 이벤트 종료 후 1개월 이내 파기
동의를 거부할 권리가 있으며, 거부 시 제품 발송이 불가합니다.`;
