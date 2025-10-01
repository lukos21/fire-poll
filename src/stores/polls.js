import { defineStore } from 'pinia';
import { createPoll, getPollOnce, onPoll, vote } from '@/services/polls';

export const usePollStore = defineStore('poll', {
  state: () => ({ current: null, _unsub: null }),
  actions: {
    async fetchOnce(id) { this.current = await getPollOnce(id); },
    watch(id) {
      if (this._unsub) this._unsub();
      this._unsub = onPoll(id, (p) => { this.current = p; });
    },
    stop() { if (this._unsub) this._unsub(); this._unsub = null; },
    create: createPoll,
    vote: vote,
  },
});
