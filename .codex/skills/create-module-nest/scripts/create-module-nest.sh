#!/usr/bin/env bash

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Uso: create-module-nest <nombre-modulo>"
  exit 1
fi

RAW_NAME="$1"
BASE_PATH="src/api"

to_kebab_case() {
  echo "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[[:space:]_]+/-/g' \
    | sed -E 's/[^a-z0-9-]//g' \
    | sed -E 's/-+/-/g' \
    | sed -E 's/^-+|-+$//g'
}

to_pascal_case() {
  echo "$1" \
    | sed -E 's/[-_]+/ /g' \
    | awk '{
        for (i = 1; i <= NF; i++) {
          $i = toupper(substr($i,1,1)) tolower(substr($i,2))
        }
        gsub(/ /, "")
        print
      }'
}

lower_first() {
  local value="$1"
  echo "$(tr '[:upper:]' '[:lower:]' <<< "${value:0:1}")${value:1}"
}

pluralize() {
  local word="$1"

  if [[ "$word" =~ y$ ]]; then
    echo "${word%y}ies"
  elif [[ "$word" =~ (s|x|z|ch|sh)$ ]]; then
    echo "${word}es"
  else
    echo "${word}s"
  fi
}

MODULE_NAME="$(to_kebab_case "$RAW_NAME")"

if [ -z "$MODULE_NAME" ]; then
  echo "Nombre de módulo inválido"
  exit 1
fi

CLASS_NAME="$(to_pascal_case "$MODULE_NAME")"
CLASS_VAR_NAME="$(lower_first "$CLASS_NAME")"
COLLECTION_NAME="$(pluralize "$MODULE_NAME")"

MODULE_PATH="${BASE_PATH}/${MODULE_NAME}"

if [ -d "$MODULE_PATH" ]; then
  echo "El módulo ya existe en: $MODULE_PATH"
  exit 1
fi

mkdir -p "${MODULE_PATH}/application/services"
mkdir -p "${MODULE_PATH}/domain/models"
mkdir -p "${MODULE_PATH}/domain/ports"
mkdir -p "${MODULE_PATH}/infrastructure/controllers"
mkdir -p "${MODULE_PATH}/infrastructure/repositories"
mkdir -p "${MODULE_PATH}/infrastructure/schemas"

cat > "${MODULE_PATH}/application/services/${MODULE_NAME}.service.ts" <<EOF
import { Injectable } from '@nestjs/common';
import { ${CLASS_NAME}Model } from '../../domain/models/${MODULE_NAME}.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { ServicePort } from '../../domain/ports/service.port';

@Injectable()
export class ${CLASS_NAME}Service implements ServicePort {
  constructor(private readonly repository: RepositoryPort) {}

  async create(data: ${CLASS_NAME}Model): Promise<string> {
    return await this.repository.create(data);
  }
}
EOF

cat > "${MODULE_PATH}/domain/models/${MODULE_NAME}.model.ts" <<EOF
export interface ${CLASS_NAME}Model {
  name: string;
}
EOF

cat > "${MODULE_PATH}/domain/ports/repository.port.ts" <<EOF
import { ${CLASS_NAME}Model } from '../models/${MODULE_NAME}.model';

export abstract class RepositoryPort {
  abstract create(data: ${CLASS_NAME}Model): Promise<string>;
}
EOF

cat > "${MODULE_PATH}/domain/ports/service.port.ts" <<EOF
import { ${CLASS_NAME}Model } from '../models/${MODULE_NAME}.model';

export abstract class ServicePort {
  abstract create(data: ${CLASS_NAME}Model): Promise<string>;
}
EOF

cat > "${MODULE_PATH}/infrastructure/controllers/${MODULE_NAME}.controller.ts" <<EOF
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ServicePort } from '../../domain/ports/service.port';
import { ${CLASS_NAME}Dto } from './${MODULE_NAME}.dto';

@Controller('v1')
export class ${CLASS_NAME}Controller {
  constructor(private readonly service: ServicePort) {}

  @Post('/${MODULE_NAME}')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }))
  async create(@Body() dto: ${CLASS_NAME}Dto): Promise<string> {
    return this.service.create(dto);
  }
}
EOF

cat > "${MODULE_PATH}/infrastructure/controllers/${MODULE_NAME}.dto.ts" <<EOF
import { IsNotEmpty, IsString } from 'class-validator';
import { ${CLASS_NAME}Model } from '../../domain/models/${MODULE_NAME}.model';

export class ${CLASS_NAME}Dto implements ${CLASS_NAME}Model {
  @IsString()
  @IsNotEmpty()
  name: string;
}
EOF

cat > "${MODULE_PATH}/infrastructure/controllers/${MODULE_NAME}.controller.spec.ts" <<EOF
import { Test, TestingModule } from '@nestjs/testing';
import { ${CLASS_NAME}Controller } from './${MODULE_NAME}.controller';
import { ServicePort } from '../../domain/ports/service.port';

describe('${CLASS_NAME}Controller', () => {
  let controller: ${CLASS_NAME}Controller;
  let service: { create: jest.Mock };

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue('ok'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [${CLASS_NAME}Controller],
      providers: [
        {
          provide: ServicePort,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<${CLASS_NAME}Controller>(${CLASS_NAME}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok', async () => {
    await expect(controller.create({ name: 'test' })).resolves.toBe('ok');
    expect(service.create).toHaveBeenCalledWith({ name: 'test' });
  });
});
EOF

cat > "${MODULE_PATH}/infrastructure/repositories/mongo.repository.ts" <<EOF
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ${CLASS_NAME}Model } from '../../domain/models/${MODULE_NAME}.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { ${CLASS_NAME}, ${CLASS_NAME}Document } from '../schemas/${MODULE_NAME}.schema';

@Injectable()
export class MongoRepository implements RepositoryPort {
  constructor(
    @InjectModel(${CLASS_NAME}.name)
    private readonly ${CLASS_VAR_NAME}Model: Model<${CLASS_NAME}Document>,
  ) {}

  async create(data: ${CLASS_NAME}Model): Promise<string> {
    await this.${CLASS_VAR_NAME}Model.create(data);
    return 'ok';
  }
}
EOF

cat > "${MODULE_PATH}/infrastructure/schemas/${MODULE_NAME}.schema.ts" <<EOF
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ${CLASS_NAME}Document = HydratedDocument<${CLASS_NAME}>;

@Schema({ collection: '${COLLECTION_NAME}', timestamps: true })
export class ${CLASS_NAME} {
  @Prop({ required: true, trim: true })
  name: string;
}

export const ${CLASS_NAME}Schema = SchemaFactory.createForClass(${CLASS_NAME});
EOF

cat > "${MODULE_PATH}/${MODULE_NAME}.module.ts" <<EOF
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ${CLASS_NAME}Controller } from './infrastructure/controllers/${MODULE_NAME}.controller';
import { ${CLASS_NAME}Service } from './application/services/${MODULE_NAME}.service';
import { ServicePort } from './domain/ports/service.port';
import { MongoRepository } from './infrastructure/repositories/mongo.repository';
import { RepositoryPort } from './domain/ports/repository.port';
import { ${CLASS_NAME}, ${CLASS_NAME}Schema } from './infrastructure/schemas/${MODULE_NAME}.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ${CLASS_NAME}.name, schema: ${CLASS_NAME}Schema },
    ]),
  ],
  controllers: [${CLASS_NAME}Controller],
  providers: [
    { provide: ServicePort, useClass: ${CLASS_NAME}Service },
    { provide: RepositoryPort, useClass: MongoRepository },
  ],
})
export class ${CLASS_NAME}Module {}
EOF

echo "Módulo creado correctamente en: ${MODULE_PATH}"
find "${MODULE_PATH}" -type f | sort