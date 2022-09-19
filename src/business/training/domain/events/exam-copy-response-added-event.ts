import { ResponseEntity } from '@business/training/domain/entities/response.entity';

export class ExamCopyResponseAddedEvent {
  constructor(public examCopyId: string, public response: ResponseEntity) {}
}
