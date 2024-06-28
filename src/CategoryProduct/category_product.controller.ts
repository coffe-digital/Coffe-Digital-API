import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
  } from '@nestjs/common';
  import { CategoryProductService } from './category_product.service';
  import { CreateCategoryProductDto } from './dto/create-category_product.dto';
  import { UpdateCategoryProductDto } from './dto/update-category_product.dto';
  import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
  @ApiTags('category-products')
  @Controller('category-product')
  export class CategoryProductController {
    constructor(private readonly categoryProductService: CategoryProductService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new category product' })
    @ApiResponse({ status: 201, description: 'The category product has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    create(@Body() createCategoryProductDto: CreateCategoryProductDto) {
      return this.categoryProductService.create(createCategoryProductDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Find category product' })
    @ApiQuery({ name: 'id', required: false, description: 'Category Product ID' })
    @ApiQuery({ name: 'productId', required: false, description: 'Product ID' })
    @ApiQuery({ name: 'categoryId', required: false, description: 'Category ID' })
    @ApiResponse({ status: 200, description: 'Category product retrieved successfully.' })
    findById(
      @Query('id') id?: string,
      @Query('productId') productId?: string,
      @Query('categoryId') categoryId?: string,
    ) {
      if (productId && categoryId) {
        return this.categoryProductService.findByCategoryAndProduct(
          +categoryId,
          +productId,
        );
      }
  
      if (productId) {
        return this.categoryProductService.findCategoriesByProduct(+productId);
      }
  
      if (categoryId) {
        return this.categoryProductService.findProductsByCategory(+categoryId);
      }
  
      if (id) {
        return this.categoryProductService.findById(+id);
      }
  
      return this.categoryProductService.findAll();
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a category product' })
    @ApiParam({ name: 'id', description: 'Category Product ID' })
    @ApiResponse({ status: 200, description: 'The category product has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Category product not found.' })
    update(
      @Param('id') id: string,
      @Body() updateCategoryProductDto: UpdateCategoryProductDto,
    ) {
      return this.categoryProductService.update(+id, updateCategoryProductDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a category product' })
    @ApiParam({ name: 'id', description: 'Category Product ID' })
    @ApiResponse({ status: 200, description: 'The category product has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Category product not found.' })
    remove(@Param('id') id: string) {
      return this.categoryProductService.remove(+id);
    }
  }
  