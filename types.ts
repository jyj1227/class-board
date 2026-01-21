export interface Student {
  id: number;
  name: string;
  emotion: string; // '😊', '😍', '😢', '😡', '😴' or '😐' (neutral)
  hasStar: boolean;
}

export const EMOTIONS = ['😊', '😍', '😢', '😡', '😴', '😐'];

export type TabType = 
  | 'hearts' 
  | 'stats' 
  | 'timetable'
  | 'vote'
  | 'wordcloud'
  | 'timer' 
  | 'dice' 
  | 'picker' 
  | 'memo' 
  | 'notice';

export interface LunchMenu {
  date: string;
  menu: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}