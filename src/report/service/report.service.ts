import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../client/create-report.dto';
import { Report } from '../model/report.entity';
import { User } from '../../auth/model/user.entity';
import { ApproveReportDto } from '../client/approve-report.dto';
import { GetEstimateDto } from '../client/get-estimate.dto';

@Injectable()
export class ReportService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
  create(req: CreateReportDto, user: User) {
    const report = this.repo.create(req);
    report.userId = user.id;
    return this.repo.save(report);
  }

  async approve(reportId: number, approved: boolean) {
    const report = await this.repo.findOne(reportId);
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  getEstimate(estimateDto: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('lng - :lng BETWEEN -5 and 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat BETWEEN -5 and 5', { lat: estimateDto.lat })
      .andWhere('year - :year BETWEEN -3 and 3', { year: estimateDto.year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne();
  }
}
