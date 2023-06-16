import { Controller, Get, Res, UseFilters, Post, Req, Put, UseGuards, Delete, Patch } from '@nestjs/common';
import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import { ServiceErrorCatcher } from 'src/common/decorators/catch.decorator';
import { BoardsService } from 'src/base/boards/boards.service';

@Controller('boards')
@UseFilters(ServiceErrorCatcher)
export class BoardsController {
	constructor(private readonly boardsService: BoardsService) {}

	@Get('')
	async getBoards(@Req() req: Request, @Res() res: Response) {
		const boards = await this.boardsService.getBoards();
		return res.status(201).json(boards);
	}

	@Get('/project/:id')
	async getBoardByProjectId(@Req() req: Request, @Res() res: Response) {
		const board = await this.boardsService.getBoardByProjectId(req.params.id);
		return res.status(201).json(board);
	}

	@Post('/create')
	async addBoard(@Req() req: Request, @Res() res: Response) {
		req.body.project = new ObjectId(req.body.project);
		const project = await this.boardsService.createBoard(req.body);
		return res.status(201).json({ project, id: project.insertedId });
	}

	@Delete('/delete/:id')
	async deleteBoardById(@Req() req: Request, @Res() res: Response) {
		const board = await this.boardsService.deleteBoardById(req.params.id);
		return res.status(202).json(board);
	}
}
