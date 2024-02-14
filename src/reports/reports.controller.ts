import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from 'src/reports/dtos/create-report.dto';
import { ReportsService } from 'src/reports/reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from 'src/reports/dtos/report.dto';
import { UpdateReportDto } from 'src/reports/dtos/update-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateReportDto } from 'src/reports/dtos/get-estimate-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.createReport(body, user);
  }

  @Get('')
  async getEstimate(@Query() query: GetEstimateReportDto) {
    console.log('query', query);
    // return this.reportService.findOne(parseInt(id));
  }

  @Get('/:id')
  async findReport(@Param('id') id: string) {
    return this.reportService.findOne(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  @Serialize(ReportDto)
  async updateReport(
    @Param('id') id: string,
    @Body() body: UpdateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportService.updateReport(parseInt(id), body, user);
  }
}
