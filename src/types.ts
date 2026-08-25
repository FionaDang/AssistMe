export type Need = {
  id: string
  english: string
  chinese: string
}

export type Category = {
  id: string
  english: string
  chinese: string
  color: string
  needs: Need[]
}