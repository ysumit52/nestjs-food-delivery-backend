import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from './entities/category.entity'
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from './entities/menu-item.entity';
import { CreateCategoryDto } from '@app/common';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  // Categories
  async createCategory(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async getAllCategories() {
    return this.categoryRepository.find({
      where: { isActive: true },
      relations: ['menuItems'],
    });
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['menuItems'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // Restaurants
  async getAllRestaurants() {
    return this.restaurantRepository.find({
      where: { isActive: true },
    });
  }

  async getRestaurantById(id: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, isActive: true },
      relations: ['menuItems', 'menuItems.category'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  // Menu Items
  async getMenuItemsByCategory(categoryId: string) {
    return this.menuItemRepository.find({
      where: { categoryId, isAvailable: true },
      relations: ['category', 'restaurant'],
    });
  }

  async getMenuItemsByRestaurant(restaurantId: string) {
    return this.menuItemRepository.find({
      where: { restaurantId, isAvailable: true },
      relations: ['category', 'restaurant'],
    });
  }

  async searchMenuItems(query: string) {
    return this.menuItemRepository.find({
      where: [
        { name: Like(`%${query}%`), isAvailable: true },
        { description: Like(`%${query}%`), isAvailable: true },
      ],
      relations: ['category', 'restaurant'],
    });
  }

  async getMenuItemById(id: string) {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id, isAvailable: true },
      relations: ['category', 'restaurant'],
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }
}
