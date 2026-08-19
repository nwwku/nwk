import type { ProfileGender } from './profilePreferences';
import { supabase } from './supabase';

export type OutfitPlan = {
  id: string; plannedFor: string; title: string; occasion: string; wardrobeItemIds: string[];
};

type PlanRow = { id: string; planned_for: string; title: string; occasion: string; wardrobe_item_ids: string[] };

export async function loadPlans(gender: ProfileGender) {
  const { data, error } = await supabase.from('outfit_plans').select('id,planned_for,title,occasion,wardrobe_item_ids')
    .eq('gender', gender).order('planned_for');
  if (error) throw error;
  return (data as PlanRow[]).map((row) => ({ id: row.id, plannedFor: row.planned_for, title: row.title, occasion: row.occasion, wardrobeItemIds: row.wardrobe_item_ids }));
}

export async function addPlan(userId: string, gender: ProfileGender, plan: Omit<OutfitPlan, 'id'>) {
  const { data, error } = await supabase.from('outfit_plans').insert({ user_id: userId, gender, planned_for: plan.plannedFor,
    title: plan.title, occasion: plan.occasion, wardrobe_item_ids: plan.wardrobeItemIds }).select('id,planned_for,title,occasion,wardrobe_item_ids').single();
  if (error) throw error;
  const row = data as PlanRow;
  return { id: row.id, plannedFor: row.planned_for, title: row.title, occasion: row.occasion, wardrobeItemIds: row.wardrobe_item_ids };
}

export async function removePlan(id: string) {
  const { error } = await supabase.from('outfit_plans').delete().eq('id', id);
  if (error) throw error;
}

export async function logWear(userId: string, wardrobeItemId: string) {
  const { error } = await supabase.from('wear_logs').upsert({ user_id: userId, wardrobe_item_id: wardrobeItemId, worn_on: new Date().toISOString().slice(0, 10) }, { onConflict: 'user_id,wardrobe_item_id,worn_on' });
  if (error) throw error;
}

export async function loadWearCounts() {
  const { data, error } = await supabase.from('wear_logs').select('wardrobe_item_id,worn_on');
  if (error) throw error;
  const rows = data as Array<{ wardrobe_item_id: string; worn_on: string }>;
  return rows.reduce<Record<string, number>>((counts, row) => ({ ...counts, [row.wardrobe_item_id]: (counts[row.wardrobe_item_id] ?? 0) + 1 }), {});
}

export async function loadCapsuleIds() {
  const { data, error } = await supabase.from('capsule_items').select('wardrobe_item_id');
  if (error) throw error;
  return (data as Array<{ wardrobe_item_id: string }>).map((row) => row.wardrobe_item_id);
}

export async function setCapsuleItem(userId: string, itemId: string, selected: boolean) {
  const query = selected
    ? supabase.from('capsule_items').upsert({ user_id: userId, wardrobe_item_id: itemId })
    : supabase.from('capsule_items').delete().eq('wardrobe_item_id', itemId);
  const { error } = await query;
  if (error) throw error;
}

export async function loadActivityTotals() {
  const [wears, plans, capsule] = await Promise.all([
    supabase.from('wear_logs').select('id', { count: 'exact', head: true }),
    supabase.from('outfit_plans').select('id', { count: 'exact', head: true }),
    supabase.from('capsule_items').select('wardrobe_item_id', { count: 'exact', head: true }),
  ]);
  if (wears.error || plans.error || capsule.error) throw wears.error ?? plans.error ?? capsule.error;
  return { wears: wears.count ?? 0, plans: plans.count ?? 0, capsule: capsule.count ?? 0 };
}
