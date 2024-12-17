import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError } from 'rxjs'
import { NATS_SERVICE } from 'src/config'
import { CreateOrderDto, OrderPaginationDto } from './dto'
import { StatusDto } from './dto/status.dto'

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('create_order', createOrderDto)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Get()
  findAll(@Query() pagination: OrderPaginationDto) {
    return this.client.send('find_all_orders', pagination)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find_one_order', { id })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    return this.client.send('change_order_status', { id, status: statusDto.status })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }
}
