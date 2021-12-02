import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../client/create-report.dto';
import { Report } from '../model/report.entity';
import { User } from '../../auth/model/user.entity';
import { ApproveReportDto } from '../client/approve-report.dto';

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
}
