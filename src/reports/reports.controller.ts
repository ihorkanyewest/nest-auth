import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from 'src/reports/dtos/create-report.dto';
import { ReportsService } from 'src/reports/reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}
  @Post()
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.createReport(body, user);
  }
}
