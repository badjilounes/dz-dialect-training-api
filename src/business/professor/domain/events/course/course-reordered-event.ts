export class CourseReorderedEvent {
  constructor(public readonly id: string, public order: number) {}
}
