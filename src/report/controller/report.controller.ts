import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateReportDto } from '../client/create-report.dto';
import { ReportService } from '../service/report.service';
import { AuthGuard } from '../../guard/auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { User } from '../../auth/model/user.entity';
import { ApproveReportDto } from '../client/approve-report.dto';
import { AdminGuard } from 'src/guard/admin.guard';

@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}
  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create report' })
  createReport(
    @Body() createReport: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportService.create(createReport, user);
  }

  @Put('/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Approve report' })
  approveReport(@Param('id') reportId: number, @Body() body: ApproveReportDto) {
    return this.reportService.approve(reportId, body.approved);
  }
}
