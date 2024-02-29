export interface SortBy {
  sort: SortByEnum;
  desc: 0 | 1;
}

export enum SortByEnum {
  id = 'id',
  date = 'date',
  total = 'total',
  state = 'state',
  name = 'name',
  lastname = 'last name',
  email = 'email',
  idcard = 'id card',
  price = 'price',
  cost = 'cost',
  stock = 'stock',
  rol = 'rol'
}
