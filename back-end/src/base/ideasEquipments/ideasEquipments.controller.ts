import { Controller, Get, Res, UseFilters, Post, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { IdeasEquipmentsService } from 'src/base/ideasEquipments/ideasEquipments.service';

import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from '@/common/guards/auth.guard';
import { Jwt } from '@/common/decorators/jwt.decorator';

@Controller('ideasequipments')
@UseFilters(ServiceErrorCatcher)
export class IdeasEquipmentsController {
	constructor(private readonly ideasEquipmentsService: IdeasEquipmentsService) { }

	@Get()
	index(@Res() res: Response) {
		console.log("qwack")
		return this.ideasEquipmentsService.get();
	}

	@Post('/add')
	addArticle(@Req() req: Request, @Res() res: Response) {
		this.ideasEquipmentsService.addIdea(req.body).then((article) => {
			return res.status(201).json(article);
		});
	}
}

class MyController {

	@Get("something")
	@UseGuards(JwtAuthGuard) // Vérification du cookie d'authentification envoyé par la requête http.
	async getSomething(
	  @Jwt() userId: ObjectId, // Paramètre custom qui intercepte la requête et récupère le userId du JWT contenu dans le cookie d'authentification.
	  @Res() res: Response)
	{
	  return res.status(201).json({ status: 'ok' });
	}
  }
