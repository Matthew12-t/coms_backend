const supabase = require('../config/supabase');
const { sendExpoPush, buildMessage } = require('./pushService');

const triggerNotificationsForCanteen = async (canteenId, headCount) => {
  const { data: pending, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('canteen_id', canteenId)
    .eq('is_triggered', false);
  if (error) throw new Error(error.message);

  const toTrigger = pending.filter((n) => headCount <= n.threshold);
  if (!toTrigger.length) return [];

  const ids = toTrigger.map((n) => n.id);
  const { error: updateErr } = await supabase
    .from('notifications')
    .update({ is_triggered: true, triggered_at: new Date().toISOString() })
    .in('id', ids);
  if (updateErr) throw new Error(updateErr.message);

  await dispatchPushNotifications(canteenId, headCount, toTrigger);
  return toTrigger;
};

const dispatchPushNotifications = async (canteenId, headCount, triggered) => {
  const userIds = [...new Set(triggered.map((n) => n.user_id))];
  if (!userIds.length) return;

  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('user_id, push_token')
    .in('user_id', userIds);
  if (!prefs?.length) return;

  const { data: canteen } = await supabase
    .from('canteens')
    .select('name')
    .eq('id', canteenId)
    .single();

  const canteenName = canteen?.name || 'Your canteen';
  const messages = prefs
    .filter((p) => p.push_token)
    .map((p) =>
      buildMessage(
        p.push_token,
        `${canteenName} sudah lebih sepi`,
        `Sekarang sekitar ${headCount} orang. Yuk ke kantin sekarang!`,
        { canteen_id: canteenId, head_count: headCount }
      )
    );

  if (!messages.length) return;
  try {
    await sendExpoPush(messages);
  } catch (err) {
    console.error('Push dispatch failed:', err.message);
  }
};

module.exports = { triggerNotificationsForCanteen };
