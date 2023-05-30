export interface IRootState {
  user: {
    user: {
      id?: string;
      name?: string;
      username?: string;
      role?: string;
      email?: string;
      cell?: string;
      userImg?: string | null | undefined;
      points?: number;
      likes?: string[],
      dislikes?: string[];
      socials?: string[];
    };
  };
  isLoading: boolean;
}

export interface IState {
  id?: string;
  name?: string;
  username?: string;
  role?: string;
  email?: string;
  cell?: string;
  userImg?: string | null | undefined;
  points?: number;
  likes?: string[],
  dislikes?: string[];
  socials?: string[];
}

export interface IEvent {
  id: string;
  name: string;
  slug: string;
  date: string | object;
  description: string;
  commentsCount: number;
  rating: number;
  views: number;
  mainImage: string;
  eventImages: string[];
}