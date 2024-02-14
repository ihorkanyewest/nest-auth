import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsBoolean()
  approved: boolean;
}
