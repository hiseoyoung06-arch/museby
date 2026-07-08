export type ContactType = "email" | "address";

export interface Brand {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface CommentEvent {
  id: string;
  brand_id: string;
  campaign_name: string;
  prize: string;
  winner_count: number;
  final_upload_date: string; // YYYY-MM-DD
  contact_type: ContactType;
  notice: string | null;
  form_slug: string;
  created_at: string;
}

export interface Winner {
  id: string;
  event_id: string;
  channel_name: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  postal_code: string | null;
  consent: boolean;
  delivered: boolean;
  created_at: string;
}
