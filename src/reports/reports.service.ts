import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/reports/report.entity';
import { CreateReportDto } from 'src/reports/dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async createReport(props: CreateReportDto, user: User) {
    const report = this.repo.create(props);

    report.user = user;

    return this.repo.save(report);
  }
}
