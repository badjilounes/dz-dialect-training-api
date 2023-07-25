import { ProfessorQueryBusFacade } from './professor.query-bus-facade';
import { PROFESSOR_QUERY_FACADE_TOKEN } from './tokens';

export const ProfessorFacades = [
  {
    provide: PROFESSOR_QUERY_FACADE_TOKEN,
    useClass: ProfessorQueryBusFacade,
  },
];
