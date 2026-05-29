import { IncidentPriority } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Database connection instability' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title!: string;

  @ApiProperty({
    example: 'Users are experiencing intermittent connection failures.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description!: string;

  @ApiProperty({
    example: 'infrastructure',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  category!: string;

  @ApiProperty({
    example: 'Caique Brandão',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  assignee?: string;

  @ApiProperty({
    enum: IncidentPriority,
    enumName: 'IncidentPriority',
    example: IncidentPriority.HIGH,
  })
  @IsEnum(IncidentPriority)
  priority!: IncidentPriority;
}