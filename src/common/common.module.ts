import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { Region } from './entities/region.entity';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';
import { UtilsModule } from 'src/util/utils.module';
import { Social } from './entities/social.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Country, Region, Social]),
    UtilsModule,
  ],
  controllers: [GeoController],
  providers: [GeoService],
})
export class CommonModule {}
