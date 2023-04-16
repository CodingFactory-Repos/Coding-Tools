import { IsNotEmpty, IsString, Length, Matches, IsNumber, Min, Max, IsOptional, IsBoolean } from "class-validator";

export class ProjectMetaDTO {
	@IsNotEmpty()
	@IsString()
	@Length(1, 25)
	title: string;

	@IsOptional()
	@IsString()
	@Length(0, 100)
	description: string;

	@IsOptional()
	@IsString()
	snapshot: string;

	@IsOptional()
	@IsBoolean()
	readonly: boolean;
}