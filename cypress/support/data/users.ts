import usersData from "../../fixtures/users.json";

type UsersFixture = {
  password: string;
  usernames: {
    standard: string;
    lockedOut: string;
    problem: string;
    performance: string;
    error: string;
    visual: string;
  };
  defaultPostalCode: string;
};

export const users = usersData as UsersFixture;
export type { UsersFixture };


