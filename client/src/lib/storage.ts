import { type RitualProgress, type JournalEntry } from "@shared/schema";

export const StorageKeys = {
  RITUAL_PROGRESS: (slug: string) => `ritual_${slug}`,
  JOURNAL_ENTRY: 'journal_entry',
  INSTALL_PROMPT_DISMISSED: 'install_prompt_dismissed',
  LAST_VISIT: 'last_visit',
  LAST_JOURNAL_DATE: 'last_journal_date',
} as const;

export class LocalStorage {
  static getRitualProgress(slug: string): RitualProgress | null {
    try {
      const data = localStorage.getItem(StorageKeys.RITUAL_PROGRESS(slug));
      if (!data) return null;
      return JSON.parse(data) as RitualProgress;
    } catch (error) {
      console.error('Failed to get ritual progress:', error);
      return null;
    }
  }

  static setRitualProgress(slug: string, progress: RitualProgress): void {
    try {
      localStorage.setItem(
        StorageKeys.RITUAL_PROGRESS(slug),
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error('Failed to save ritual progress:', error);
    }
  }

  static getAllRitualProgress(): Record<string, RitualProgress> {
    const allProgress: Record<string, RitualProgress> = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ritual_')) {
          const slug = key.replace('ritual_', '');
          const progress = this.getRitualProgress(slug);
          if (progress) {
            allProgress[slug] = progress;
          }
        }
      }
    } catch (error) {
      console.error('Failed to get all ritual progress:', error);
    }

    return allProgress;
  }

  static getJournalEntry(): JournalEntry | null {
    try {
      const data = localStorage.getItem(StorageKeys.JOURNAL_ENTRY);
      if (!data) return null;
      return JSON.parse(data) as JournalEntry;
    } catch (error) {
      console.error('Failed to get journal entry:', error);
      return null;
    }
  }

  static setJournalEntry(entry: JournalEntry): void {
    try {
      localStorage.setItem(
        StorageKeys.JOURNAL_ENTRY,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    }
  }

  static isInstallPromptDismissed(): boolean {
    try {
      const dismissed = localStorage.getItem(StorageKeys.INSTALL_PROMPT_DISMISSED);
      return dismissed === 'true';
    } catch (error) {
      console.error('Failed to check install prompt status:', error);
      return false;
    }
  }

  static setInstallPromptDismissed(dismissed: boolean): void {
    try {
      localStorage.setItem(
        StorageKeys.INSTALL_PROMPT_DISMISSED,
        dismissed.toString()
      );
    } catch (error) {
      console.error('Failed to save install prompt status:', error);
    }
  }

  static getLastVisit(): Date | null {
    try {
      const lastVisit = localStorage.getItem(StorageKeys.LAST_VISIT);
      return lastVisit ? new Date(lastVisit) : null;
    } catch (error) {
      console.error('Failed to get last visit:', error);
      return null;
    }
  }

  static setLastVisit(date: Date): void {
    try {
      localStorage.setItem(StorageKeys.LAST_VISIT, date.toISOString());
    } catch (error) {
      console.error('Failed to save last visit:', error);
    }
  }

  static getLastJournalDate(): Date | null {
    try {
      const lastDate = localStorage.getItem(StorageKeys.LAST_JOURNAL_DATE);
      return lastDate ? new Date(lastDate) : null;
    } catch (error) {
      console.error('Failed to get last journal date:', error);
      return null;
    }
  }

  static setLastJournalDate(date: Date): void {
    try {
      localStorage.setItem(StorageKeys.LAST_JOURNAL_DATE, date.toISOString());
    } catch (error) {
      console.error('Failed to save last journal date:', error);
    }
  }

  static saveJournalWithStreak(content: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastJournalDate = this.getLastJournalDate();
    const entry = this.getJournalEntry();
    
    let newStreak = 1;

    if (lastJournalDate) {
      const lastDate = new Date(lastJournalDate);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        newStreak = entry?.streak || 1;
      } else if (diffDays === 1) {
        newStreak = (entry?.streak || 0) + 1;
      } else {
        newStreak = 1;
      }
    }

    this.setLastJournalDate(today);

    this.setJournalEntry({
      content,
      lastSaved: new Date().toISOString(),
      streak: newStreak,
    });

    return newStreak;
  }

  static clearAll(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  static getStats() {
    const allProgress = this.getAllRitualProgress();
    
    const totalRituals = Object.keys(allProgress).length;
    const completedRituals = Object.values(allProgress).filter(
      progress => progress.completedSteps.length > 0
    ).length;

    const journal = this.getJournalEntry();
    const journalEntries = journal?.content && journal.content.trim().length > 0 ? 1 : 0;
    const streak = journal?.streak || 0;

    return {
      totalRituals,
      completedRituals,
      journalEntries,
      streak,
    };
  }
}

export const initializeApp = () => {
  LocalStorage.setLastVisit(new Date());
};
