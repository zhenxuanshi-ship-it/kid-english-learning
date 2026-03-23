export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nickname: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nickname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nickname?: string | null;
          updated_at?: string;
        };
      };
      children: {
        Row: {
          id: string;
          parent_id: string;
          name: string;
          avatar_emoji: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          name: string;
          avatar_emoji?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          avatar_emoji?: string | null;
          updated_at?: string;
        };
      };
      word_progress: {
        Row: {
          id: string;
          child_id: string;
          word_english: string;
          category: string | null;
          correct_count: number;
          wrong_count: number;
          mastery_level: number;
          last_practiced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          word_english: string;
          category?: string | null;
          correct_count?: number;
          wrong_count?: number;
          mastery_level?: number;
          last_practiced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          correct_count?: number;
          wrong_count?: number;
          mastery_level?: number;
          last_practiced_at?: string | null;
          updated_at?: string;
        };
      };
      daily_records: {
        Row: {
          id: string;
          child_id: string;
          record_date: string;
          words_practiced: number;
          correct_count: number;
          wrong_count: number;
          time_spent_seconds: number;
          streak_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          record_date?: string;
          words_practiced?: number;
          correct_count?: number;
          wrong_count?: number;
          time_spent_seconds?: number;
          streak_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          words_practiced?: number;
          correct_count?: number;
          wrong_count?: number;
          time_spent_seconds?: number;
          streak_days?: number;
          updated_at?: string;
        };
      };
      sentence_progress: {
        Row: {
          id: string;
          child_id: string;
          pattern_id: string;
          stage: number;
          correct_count: number;
          wrong_count: number;
          last_practiced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          pattern_id: string;
          stage?: number;
          correct_count?: number;
          wrong_count?: number;
          last_practiced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stage?: number;
          correct_count?: number;
          wrong_count?: number;
          last_practiced_at?: string | null;
          updated_at?: string;
        };
      };
      learning_sessions: {
        Row: {
          id: string;
          child_id: string;
          session_type: 'word' | 'sentence' | 'review' | 'game';
          category: string | null;
          total_questions: number;
          correct_count: number;
          wrong_count: number;
          time_spent_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          session_type: string;
          category?: string | null;
          total_questions?: number;
          correct_count?: number;
          wrong_count?: number;
          time_spent_seconds?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          session_type?: string;
          category?: string | null;
          total_questions?: number;
          correct_count?: number;
          wrong_count?: number;
          time_spent_seconds?: number;
          created_at?: string;
        };
      };
      children_summary: {
        Row: {
          child_id: string;
          child_name: string;
          avatar_emoji: string | null;
          parent_id: string;
          words_practiced: number;
          words_mastered: number;
          patterns_practiced: number;
          sessions_this_week: number;
          streak_days: number;
          words_today: number | null;
          correct_today: number | null;
        };
      };
    };
    Views: {
      children_summary: {
        Row: {
          child_id: string;
          child_name: string;
          avatar_emoji: string | null;
          parent_id: string;
          words_practiced: number;
          words_mastered: number;
          patterns_practiced: number;
          sessions_this_week: number;
          streak_days: number;
          words_today: number | null;
          correct_today: number | null;
        };
      };
    };
  };
}
