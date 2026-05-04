// delhi.rent — Supabase Realtime subscriptions (separate module for clarity)

import { CONFIG } from './config.js';

let channel = null;

export function subscribe(channel_name, supabase, handlers = {}) {
  if (channel) {
    supabase.removeChannel(channel);
  }

  channel = supabase.channel(channel_name)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'pins',
    }, (payload) => {
      handlers.onInsert?.(payload.new);
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'pins',
    }, (payload) => {
      handlers.onUpdate?.(payload.new);
    })
    .on('postgres_changes', {
      event: 'DELETE',
      schema: 'public',
      table: 'pins',
    }, (payload) => {
      handlers.onDelete?.(payload.old.id);
    })
    .subscribe();

  return channel;
}

export function unsubscribe() {
  // Called by app.js when cleaning up
}
