// Local storage utilities for user data privacy
export const STORAGE_KEYS = {
  RESUME_DATA: 'resume_builder_data',
  USER_PREFERENCES: 'resume_builder_preferences',
  DRAFT_DATA: 'resume_builder_draft',
  FEEDBACK_DATA: 'resume_builder_feedback',
} as const;

export interface StoredResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    summary: string;
  };
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  targetIndustry: string;
  jobDescription?: string;
  lastModified: string;
}

export interface UserPreferences {
  selectedTemplate: string;
  autoSave: boolean;
  theme: 'light' | 'dark';
  exportFormat: 'pdf' | 'docx' | 'html';
}

export interface FeedbackData {
  improvements: Array<{
    section: string;
    suggestion: string;
    applied: boolean;
    timestamp: string;
  }>;
  userRatings: Array<{
    feature: string;
    rating: number;
    feedback: string;
    timestamp: string;
  }>;
}

class LocalStorageManager {
  private isStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  saveResumeData(data: StoredResumeData): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      const dataWithTimestamp = {
        ...data,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(dataWithTimestamp));
      return true;
    } catch (error) {
      console.error('Failed to save resume data:', error);
      return false;
    }
  }

  loadResumeData(): StoredResumeData | null {
    if (!this.isStorageAvailable()) return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUME_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load resume data:', error);
      return null;
    }
  }

  saveDraft(data: Partial<StoredResumeData>): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      const draftData = {
        ...data,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRAFT_DATA, JSON.stringify(draftData));
      return true;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return false;
    }
  }

  loadDraft(): Partial<StoredResumeData> | null {
    if (!this.isStorageAvailable()) return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAFT_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }

  savePreferences(preferences: UserPreferences): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  loadPreferences(): UserPreferences | null {
    if (!this.isStorageAvailable()) return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  }

  saveFeedback(feedback: FeedbackData): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK_DATA, JSON.stringify(feedback));
      return true;
    } catch (error) {
      console.error('Failed to save feedback:', error);
      return false;
    }
  }

  loadFeedback(): FeedbackData | null {
    if (!this.isStorageAvailable()) return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load feedback:', error);
      return null;
    }
  }

  clearData(key?: keyof typeof STORAGE_KEYS): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      if (key) {
        localStorage.removeItem(STORAGE_KEYS[key]);
      } else {
        Object.values(STORAGE_KEYS).forEach(storageKey => {
          localStorage.removeItem(storageKey);
        });
      }
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  getStorageSize(): number {
    if (!this.isStorageAvailable()) return 0;
    
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        total += item.length;
      }
    });
    return total;
  }
}

export const storageManager = new LocalStorageManager();