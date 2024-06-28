import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role_permission/role_permission.module';
import { AddressModule } from './address/address.module';
import { ClientModule } from './client/client.module';
import { PlanModule } from './plan/plan.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CategoryProductModule } from './CategoryProduct/category_product.module';
import { ContactModule } from './contact/contact.module';
import { PurchaseModule } from './purchase/purchase.module';
import { BrandModule } from './brand/brand.module';
import { AboutUsModule } from './about_us/about_us.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    RolePermissionModule,
    ClientModule,
    AddressModule,
    PlanModule,
    ProductModule,
    CategoryModule,
    CategoryProductModule,
    ContactModule,
    PurchaseModule,
    BrandModule,
    AboutUsModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
