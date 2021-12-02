import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../client/create-report.dto';
import { Report } from '../model/report.entity';
import { User } from '../../auth/model/user.entity';

@Injectable()
export class ReportService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
  create(req: CreateReportDto, user: User) {
    const report = this.repo.create(req);
    report.userId = user.id;
    return this.repo.save(report);
  }
}
