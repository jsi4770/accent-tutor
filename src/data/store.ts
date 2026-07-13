import type { User } from "../types";
import { demoUser } from "./mockData";

// In-memory single-user store for the demo. Replace with a real DB later.
let currentUser: User = { ...demoUser };

let settings = {
  notificationsEnabled: true,
  dailyReminderTime: "20:00",
  soundEffects: true,
  language: "ko",
};

export function getUser(): User {
  return currentUser;
}

export function updateUser(patch: Partial<User>): User {
  currentUser = { ...currentUser, ...patch };
  return currentUser;
}

export function getSettings() {
  return settings;
}

export function updateSettings(patch: Partial<typeof settings>) {
  settings = { ...settings, ...patch };
  return settings;
}
