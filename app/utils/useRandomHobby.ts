'use client';

import { useSyncExternalStore } from 'react';
import { hobbies, type Hobby } from '../data/hobbies';

// Picked once per page load in the browser. The server snapshot is null, so the static HTML
// never commits to a hobby and hydration can't mismatch; the client fills it in right after.
let pick: Hobby | null = null;

function getClientPick() {
  if (!pick) pick = hobbies[Math.floor(Math.random() * hobbies.length)];
  return pick;
}

const subscribe = () => () => {};

export function useRandomHobby(): Hobby | null {
  return useSyncExternalStore(subscribe, getClientPick, () => null);
}
