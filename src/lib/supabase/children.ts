import { supabase } from './client';

interface Child { id: string; parent_id: string; name: string; avatar_emoji: string | null; created_at: string; updated_at: string; }
interface WordProgress { id: string; child_id: string; word_english: string; category: string | null; correct_count: number; wrong_count: number; mastery_level: number; last_practiced_at: string | null; created_at: string; updated_at: string; }
interface DailyRecord { id: string; child_id: string; record_date: string; words_practiced: number; correct_count: number; wrong_count: number; time_spent_seconds: number; streak_days: number; created_at: string; updated_at: string; }

// ---- Children ----

export async function getChildren(): Promise<Child[]> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function createChild(name: string, avatarEmoji = '👦') {
  const { data, error } = await supabase
    .from('children')
    .insert({ name, avatar_emoji: avatarEmoji })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateChild(id: string, name: string, avatarEmoji: string) {
  const { data, error } = await supabase
    .from('children')
    .update({ name, avatar_emoji: avatarEmoji, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteChild(id: string) {
  const { error } = await supabase.from('children').delete().eq('id', id);
  if (error) throw error;
}

// ---- Word Progress ----

export async function getWordProgress(childId: string): Promise<WordProgress[]> {
  const { data, error } = await supabase
    .from('word_progress')
    .select('*')
    .eq('child_id', childId);
  if (error) throw error;
  return data ?? [];
}

export async function upsertWordProgress(
  childId: string,
  wordEnglish: string,
  category: string | null,
  correct: boolean
) {
  const { data: existing } = await supabase
    .from('word_progress')
    .select('*')
    .eq('child_id', childId)
    .eq('word_english', wordEnglish)
    .single();

  if (existing) {
    const masteryChange = correct ? 1 : -1;
    const newLevel = Math.max(0, Math.min(5, existing.mastery_level + masteryChange));
    const { data, error } = await supabase
      .from('word_progress')
      .update({
        correct_count: existing.correct_count + (correct ? 1 : 0),
        wrong_count: existing.wrong_count + (correct ? 0 : 1),
        mastery_level: newLevel,
        last_practiced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('word_progress')
      .insert({
        child_id: childId,
        word_english: wordEnglish,
        category,
        correct_count: correct ? 1 : 0,
        wrong_count: correct ? 0 : 1,
        mastery_level: correct ? 1 : 0,
        last_practiced_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ---- Daily Records ----

export async function getTodayRecord(childId: string): Promise<DailyRecord | null> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_records')
    .select('*')
    .eq('child_id', childId)
    .eq('record_date', today)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function upsertDailyRecord(
  childId: string,
  correct: boolean,
  timeSpent: number
) {
  const today = new Date().toISOString().split('T')[0];
  const { data: existing } = await supabase
    .from('daily_records')
    .select('*')
    .eq('child_id', childId)
    .eq('record_date', today)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('daily_records')
      .update({
        words_practiced: existing.words_practiced + 1,
        correct_count: existing.correct_count + (correct ? 1 : 0),
        wrong_count: existing.wrong_count + (correct ? 0 : 1),
        time_spent_seconds: existing.time_spent_seconds + timeSpent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data: yesterday } = await supabase
      .from('daily_records')
      .select('record_date, streak_days')
      .eq('child_id', childId)
      .order('record_date', { ascending: false })
      .limit(1)
      .single();

    const yesterdayDate = yesterday?.record_date
      ? new Date(yesterday.record_date)
      : null;
    const yesterdayStr = yesterdayDate?.toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

    let streak = 1;
    if (yesterdayStr === twoDaysAgo || !yesterday) {
      streak = (yesterday?.streak_days ?? 0) + 1;
    } else if (yesterdayStr === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
      streak = (yesterday?.streak_days ?? 0) + 1;
    } else {
      streak = 1;
    }

    const { data, error } = await supabase
      .from('daily_records')
      .insert({
        child_id: childId,
        record_date: today,
        words_practiced: 1,
        correct_count: correct ? 1 : 0,
        wrong_count: correct ? 0 : 1,
        time_spent_seconds: timeSpent,
        streak_days: streak,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ---- Sentence Progress ----

export async function upsertSentenceProgress(
  childId: string,
  patternId: string,
  correct: boolean
) {
  const { data: existing } = await supabase
    .from('sentence_progress')
    .select('*')
    .eq('child_id', childId)
    .eq('pattern_id', patternId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('sentence_progress')
      .update({
        correct_count: existing.correct_count + (correct ? 1 : 0),
        wrong_count: existing.wrong_count + (correct ? 0 : 1),
        last_practiced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('sentence_progress')
      .insert({
        child_id: childId,
        pattern_id: patternId,
        correct_count: correct ? 1 : 0,
        wrong_count: correct ? 0 : 1,
        last_practiced_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ---- Summary ----

export async function getChildrenSummary() {
  const { data, error } = await supabase
    .from('children_summary')
    .select('*');
  if (error) throw error;
  return data ?? [];
}
