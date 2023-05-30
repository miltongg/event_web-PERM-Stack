declare namespace Express {
  export interface Request {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      role: string;
      points: string;
      likes: string[];
      dislikes: string[];
      gameId: string[];
      cell: string;
      userImg: string;
    };
  }
}
