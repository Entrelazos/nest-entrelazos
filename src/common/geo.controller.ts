import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GeoService } from './geo.service';
import { CreateCityDTO } from './dto/city.dto';
import { CreateCountryDTO } from './dto/country.dto';
import { CreateRegionDTO } from './dto/region.dto';
import { Region } from './entities/region.entity';
import { City } from './entities/city.entity';

@Controller('geo')
export class GeoController {
  constructor(private geoService: GeoService) {}

  @Post('/city')
  async createCity(@Body() createCityDto: CreateCityDTO) {
    try {
      return await this.geoService.createCity(createCityDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/country')
  async createCountry(@Body() createCountryDto: CreateCountryDTO) {
    try {
      return await this.geoService.createCountry(createCountryDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/region')
  async createRegion(@Body() createRegionDto: CreateRegionDTO) {
    try {
      return await this.geoService.createRegion(createRegionDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/countries')
  async getCountries() {
    try {
      return await this.geoService.getCountries();
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':countryId/regions')
  async getRegionsByCountry(
    @Param('countryId') countryId: number,
  ): Promise<Region[]> {
    return this.geoService.getRegionsByCountry(countryId);
  }

  @Get(':regionId/cities')
  async getCitiesByregion(
    @Param('regionId') regionId: number,
  ): Promise<City[]> {
    return this.geoService.getCitiesByRegion(regionId);
  }
}
