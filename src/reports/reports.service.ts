import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/reports/report.entity';
import { CreateReportDto } from 'src/reports/dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { UpdateReportDto } from 'src/reports/dtos/update-report.dto';
import { GetEstimateReportDto } from 'src/reports/dtos/get-estimate-report.dto';

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

  async createEstimate({
    make,
    model,
    mileage,
    year,
    lng,
    lat,
  }: GetEstimateReportDto) {
    // Start building the query with a basic select
    let query = this.repo.createQueryBuilder().select('*');

    // Conditionally add filters for each parameter
    if (make !== undefined) {
      query = query.andWhere('make = :make', { make });
    }

    if (model !== undefined) {
      query = query.andWhere('model = :model', { model });
    }

    if (lng !== undefined && lat !== undefined) {
      query = query
        .andWhere('lng - :lng BETWEEN -5 AND +5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND +5', { lat });
    }

    if (year !== undefined) {
      query = query.andWhere('year - :year BETWEEN -3 AND +3', { year });
    }

    // Mileage sorting can be conditionally applied if needed
    if (mileage !== undefined) {
      query = query
        .orderBy('mileage - :mileage', 'DESC')
        .setParameters({ mileage });
    }

    // Limit the results (this can be adjusted based on your requirements)
    query = query.limit(3);

    // Execute the query
    return query.getRawMany();
  }
}
