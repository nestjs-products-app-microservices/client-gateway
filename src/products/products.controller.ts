import { catchError } from 'rxjs'
import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { PaginationDto } from 'src/common'
import { NATS_SERVICE } from 'src/config'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Get()
  findProducts(@Query() pagination: PaginationDto) {
    return this.client.send({ cmd: 'find_all_products' }, pagination)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Get(':id')
  async findProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Post()
  createProduct(@Body() productDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, productDto)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productDto: UpdateProductDto
  ) {
    return this.client.send({ cmd: 'update_product' }, { id, ...productDto })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Delete(':id')
  removeProduct(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'remove_product' }, { id })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }
}
