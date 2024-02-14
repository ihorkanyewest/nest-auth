import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/reports/report.entity';
import { CreateReportDto } from 'src/reports/dtos/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async createReport(props: CreateReportDto) {
    const report = this.repo.create(props);

    return this.repo.save(report);
  }
}
