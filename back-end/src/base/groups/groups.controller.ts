import { Controller, Get, Param, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { GroupsService } from 'src/base/groups/groups.service';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { ObjectId } from 'mongodb';

@Controller('groups')
@UseFilters(ServiceErrorCatcher)
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get()
    index(@Res() res: Response) {
        return res.status(201).json({ status: 'ok' });
    }
}
