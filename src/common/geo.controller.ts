import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GeoService } from './geo.service';
import { CreateCityDTO } from './dto/city.dto';
import { CreateCountryDTO } from './dto/country.dto';
import { CreateRegionDTO } from './dto/region.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Geography')
@UseGuards(AuthGuard('jwt'))
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

  @Get('/cities')
  async getCities(
    @Query('limit') limit: number,
    @Query('order') orderBy: string,
    @Query('dir') orderDirection: string,
    @Query('page') page: number,
    @Query('search') search: string,
  ) {
    try {
      return await this.geoService.getCities(
        limit,
        orderBy,
        orderDirection,
        page,
        search,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
