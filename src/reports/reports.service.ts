import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/reports/report.entity';
import { CreateReportDto } from 'src/reports/dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { UpdateReportDto } from 'src/reports/dtos/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async createReport(props: CreateReportDto, user: User) {
    const report = this.repo.create(props);

    report.user = user;

    return this.repo.save(report);
  }

  async findOne(id: number) {
    if (id === null) {
      throw new NotFoundException('report not found');
    }

    const report = this.repo.findOneBy({ id });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    return report;
  }

  async updateReport(id: number, props: UpdateReportDto, user: User) {
    console.log('user', user);
    const report = await this.findOne(id);

    Object.assign(report, props);

    report.user = user;

    return this.repo.update(id, report);
  }
}
