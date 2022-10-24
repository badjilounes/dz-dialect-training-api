import { ResponseEntity } from '@business/student/domain/entities/response.entity';

export class ExamCopyResponseAddedEvent {
  constructor(public examCopyId: string, public response: ResponseEntity) {}
}
