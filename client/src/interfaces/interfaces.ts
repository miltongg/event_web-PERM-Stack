export interface IRootState {
  user: {
    user: {
      id: string,
      name: string,
      username: string,
      role: string,
      email: string,
      cell: string,
      userImg: string | null
    }
  },
  isLoading: boolean
}

export interface IState {
  id?: string,
  name?: string,
  username?: string,
  role?: string,
  email?: string,
  cell?: string,
  userImg?: string | null | undefined,
  socials?: string[]
}