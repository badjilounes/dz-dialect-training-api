import { Query } from '@cqrs/query';

export type ShouldShowPresentationResult = boolean;

export class ShouldShowPresentationQuery extends Query<ShouldShowPresentationResult> {}
