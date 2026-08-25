import type { Category } from './types'

export const defaultCategories: Category[] = [
  {
    id: 'food', english: 'Food & Drink', chinese: '食物和饮料', color: 'coral', needs: [
      { id: 'water', english: 'Water', chinese: '水' },
      { id: 'meal', english: 'I would like a meal', chinese: '我想吃饭' },
      { id: 'snack', english: 'A snack, please', chinese: '请给我一点零食' },
    ],
  },
  {
    id: 'needs', english: 'My Needs', chinese: '我的需要', color: 'teal', needs: [
      { id: 'bathroom', english: 'Bathroom', chinese: '洗手间' },
      { id: 'doctor', english: 'Call the doctor', chinese: '请叫医生' },
      { id: 'pain', english: 'I am in pain', chinese: '我很痛' },
      { id: 'help', english: 'I need help', chinese: '我需要帮助' },
    ],
  },
  {
    id: 'fun', english: 'Fun & Comfort', chinese: '娱乐和舒适', color: 'yellow', needs: [
      { id: 'music', english: 'I would like music', chinese: '我想听音乐' },
      { id: 'tv', english: 'I would like to watch TV', chinese: '我想看电视' },
      { id: 'family', english: 'Call my family', chinese: '请给我的家人打电话' },
    ],
  },
]

export const copy = {
  subtitle: 'A simple way to be heard',
  choose: 'What do you need?',
  back: 'Back to categories',
  sayEnglish: 'Say in English',
  sayChinese: '用中文朗读',
  selected: 'Request selected',
  settings: 'Caregiver settings',
  close: 'Close',
  reset: 'Reset to defaults',
  add: 'Add a new request',
  editHint: 'Changes stay on this device.',
}