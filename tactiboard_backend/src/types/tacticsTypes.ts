

export interface Tactics {
    name: string;
    description: string;
    admin: string;
    create_date: string;
    team: string;
}

export interface CreateTacticsRequest  {
  body: {
    name: string;
    description: string;
    admin: string;
    team: string;
  };
}