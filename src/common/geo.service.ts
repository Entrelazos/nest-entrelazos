import { CreateCityDTO } from './dto/city.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { CreateCountryDTO } from './dto/country.dto';
import { CreateRegionDTO } from './dto/region.dto';
import { Region } from './entities/region.entity';

@Injectable()
export class GeoService {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(Region) private regionRepository: Repository<Region>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createCity(createCityDto: CreateCityDTO) {
    const validate = await this.cityRepository.findOne({
      where: { name: createCityDto.name, region_id: createCityDto.region_id },
    });

    if (validate) {
      throw new Error(`City ${createCityDto.name} exists`);
    }
    const city = this.cityRepository.create(createCityDto);
    return await this.cityRepository.save(city);
  }

  async createCountry(createCountryDto: CreateCountryDTO) {
    const validate = await this.validateUniqueness(
      'Country',
      'name',
      createCountryDto.name,
    );

    if (validate) {
      throw new Error(`The Country ${createCountryDto.name} exists`);
    }
    const country = this.countryRepository.create(createCountryDto);
    return await this.countryRepository.save(country);
  }

  async createRegion(createRegionDto: CreateRegionDTO) {
    const validate = await this.regionRepository.findOne({
      where: {
        name: createRegionDto.name,
        country_id: createRegionDto.country_id,
      },
    });

    if (validate) {
      throw new Error(`Region ${createRegionDto.name} exists`);
    }
    const region = this.regionRepository.create(createRegionDto);
    return await this.regionRepository.save(region);
  }

  async getCities(
    limit = 10,
    orderBy = 'name',
    orderDirection = 'name',
    page = 1,
    search = '',
  ): Promise<Pagination<City>> {
    const options: IPaginationOptions = { page, limit };

    const queryBuilder = this.cityRepository.createQueryBuilder('cities');

    if (search != '') {
      queryBuilder.andWhere(
        `(cities.name LIKE '%${search}%' OR cities.code LIKE '%${search}%')`,
      );
    }

    queryBuilder.orderBy(
      `cities.${orderBy ?? 'id'}`,
      orderDirection == 'DESC' ? 'DESC' : 'ASC',
    );
    return paginate<City>(queryBuilder, options);
  }

  async getCountries(
    limit = 10,
    orderBy = 'name',
    orderDirection = 'name',
    page = 1,
    search = '',
  ): Promise<Pagination<Country>> {
    const options: IPaginationOptions = { page, limit };

    const queryBuilder = this.countryRepository.createQueryBuilder('countries');
    queryBuilder.leftJoinAndSelect('countries.role', 'role');

    if (search != '') {
      queryBuilder.andWhere(
        `(countries.name LIKE '%${search}%' OR countries.code LIKE '%${search}%')`,
      );
    }

    queryBuilder.orderBy(
      `countries.${orderBy ?? 'id'}`,
      orderDirection == 'DESC' ? 'DESC' : 'ASC',
    );
    return paginate<Country>(queryBuilder, options);
  }

  private async validateUniqueness(
    entityName: string,
    column: string,
    value: any,
  ): Promise<boolean> {
    const repository = this.entityManager.getRepository(entityName);
    const existingEntity = await repository.findOne({
      where: { [column]: value },
    });
    return !!existingEntity;
  }
}
