create table if not exists t_account (
   id bigserial primary key,
   account varchar(400),
   account_name varchar(1000),
   phone varchar(40),
   gender integer,
   avatar varchar(1000),
   password varchar(200),
   created_at timestamp default current_timestamp,
   status varchar(40),
   promoter integer,
   updated_at timestamp,
   account_type varchar(40)
);

create table if not exists t_account_relation (
    id bigserial primary key,
    parent varchar(400),
    account varchar(400),
    account_name varchar(1000),
    shop_id bigint,
    status varchar(40),
    relation_type varchar(40),
    created_at timestamp default current_timestamp,
    updated_at timestamp
);

create table if not exists t_area (
    id serial primary key,
    area_name varchar(400),
    status varchar(40),
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    latitude double precision,
    longitude double precision
);

create table if not exists t_shop (
   id bigserial primary key,
   shop_name varchar(400),
   owner_account_id integer,
   owner_account varchar(400),
   brand_id integer,
   created_at timestamp default current_timestamp,
   updated_at timestamp
);

create table if not exists t_coupon_strategy(
   id bigserial primary key,
   strategy_name varchar(400),
   data json,
   status varchar(40),
   origin varchar(400),
   created_at timestamp default current_timestamp,
   updated_at timestamp
);

create table if not exists t_coupon_strategy_access(
   id bigserial primary key,
   strategy_id bigint,
   shop_id bigint,
   status varchar(40),
   created_at timestamp default current_timestamp,
   updated_at timestamp
);

create table if not exists t_coupon_template (
   id bigserial primary key,
   coupon_template_name varchar(400),
   data json,
   strategy_id bigint,
   shop_id bigint,
   status varchar(40),
   origin varchar(400),
   maxcount integer,
   begin_time timestamp,
   end_time timestamp,
   publish integer,
   created_at timestamp default current_timestamp,
   updated_at timestamp
);

create table if not exists t_coupon_instance (
   id bigserial primary key,
   coupon_instance_name varchar(400),
   data json,
   account_id bigint,
   account varchar(400),
   account_name varchar(1000),
   status varchar(40),
   template_id bigint,
   shop_id bigint,
   random_id integer,
   created_at timestamp default current_timestamp,
   updated_at timestamp
);

create table if not exists t_coupon_consumption (
    id bigserial primary key,
    coupon_instance_id integer,
    shop_id integer,
    account_consumer_id integer,
    account_consumer varchar(400),
    account_clerk_id integer,
    account_clerk varchar(400),
    latitude double precision,
    longitude double precision,
    created_at timestamp default current_timestamp,
    updated_at timestamp
);




create table if not exists t_organization (
   id bigserial primary key,
   organization_name varchar(400),
   created_at timestamp default current_timestamp,
   updated_at timestamp
);

create table if not exists t_mechanism (
   id bigserial primary key,
   mechanism_name varchar(400),
   organization_id integer,
   shop_id integer,
   created_at timestamp default current_timestamp,
   updated_at timestamp
);

create table if not exists t_category (
   id bigserial primary key,
   category_name varchar(400),
   created_at timestamp default current_timestamp,
   updated_at timestamp
);


create table if not exists t_coupon_template_instance (
   id bigserial primary key,
   coupon_template_instance_name varchar(400),
   data json,
   status varchar(40),
   publish_type varchar(40),
   template_id integer,
   brand_id integer,
   origin varchar(400),
   created_at timestamp default current_timestamp,
   updated_at timestamp
);



insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('admin','administrator', '13718961111', 0, null, 'enabled', 'admin' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('wuchunhua','吴春华', '13718961112', 2, null, 'enabled', 'admin' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('clerk','clerk', '13718961113', 0, null, 'enabled', 'clerk' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('wangminghua','wangminghua', '13718961114', 1, null, 'enabled', 'clerk' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('shop','shop', '13718961115', 0, null, 'enabled', 'merchant' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('chenwulin','chenwulin', '13718961116', 1, null, 'enabled', 'merchant' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('brand','brand', '137189611117', 0, null, 'enabled', 'brand' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('liujidong','liujidong', '13718961118', 1, null, 'enabled', 'brand' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('market','market', '13718961119', 0, null, 'enabled', 'market' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('cuipeng','cuipeng', '13718961120', 1, null, 'enabled', 'market' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('customer','customer', '13718961121', 0, null, 'enabled', 'customer' );
insert into t_account ( account, account_name, phone, gender, avatar, status, account_type) values ('liuhanru','liuhanru', '13718961122', 1, null, 'enabled', 'customer' );

insert into t_coupon_template (coupon_template_name, data, status, origin) values ('discounted','{"name":"全场打折卡", "discount":1}', 'enabled','suyuan');


insert into t_coupon_template_instance (coupon_template_instance_name, data, status, publish_type,  template_id, brand_id, origin) values ('discounted', '{"name":"双安商场全场9折", "discount":0.9, "brandName":"双安商场","count":5}','enabled', 'ninecoupon', 1, 1, 'suyuan');
