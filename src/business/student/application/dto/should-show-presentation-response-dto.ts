import { ApiProperty } from '@nestjs/swagger';

export class ShouldShowPresentationResponseDto {
  @ApiProperty()
  showPresentation!: boolean;
}
