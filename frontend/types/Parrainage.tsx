import { User } from './User';

export interface Parrainage {
  id: number;
  utilisateurParraine: User;
  parrain: User;
  promotion: boolean;
}
