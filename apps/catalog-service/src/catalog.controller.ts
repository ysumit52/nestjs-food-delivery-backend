import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ZodValidationPipe } from '@app/common';
import { CreateCategoryDto, CreateCategorySchema } from './dto/catalog.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Categories
  @Post('categories')
  async createCategory(
    @Body(new ZodValidationPipe(CreateCategorySchema)) dto: CreateCategoryDto,
  ) {
    return this.catalogService.createCategory(dto);
  }

  @Get('categories')
  async getAllCategories() {
    return this.catalogService.getAllCategories();
  }

  @Get('categories/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.catalogService.getCategoryById(id);
  }

  // Restaurants
  @Get('restaurants')
  async getAllRestaurants() {
    return this.catalogService.getAllRestaurants();
  }

  @Get('restaurants/:id')
  async getRestaurantById(@Param('id') id: string) {
    return this.catalogService.getRestaurantById(id);
  }

  // Menu Items
  @Get('menu-items')
  async searchMenuItems(@Query('q') query?: string) {
    if (query) {
      return this.catalogService.searchMenuItems(query);
    }
    return { message: 'Please provide a search query' };
  }

  @Get('menu-items/category/:categoryId')
  async getMenuItemsByCategory(@Param('categoryId') categoryId: string) {
    return this.catalogService.getMenuItemsByCategory(categoryId);
  }

  @Get('menu-items/restaurant/:restaurantId')
  async getMenuItemsByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.catalogService.getMenuItemsByRestaurant(restaurantId);
  }

  @Get('menu-items/:id')
  async getMenuItemById(@Param('id') id: string) {
    return this.catalogService.getMenuItemById(id);
  }
}