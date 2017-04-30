create table if not exists t_account (
       id bigserial primary key,
       account varchar(40),
       account_name varchar(1000),
       phone varchar(40),
       gender integer,
       avatar varchar(1000),
       password varchar(200),
       created_at timestamp,
       status varchar(40),
       promoter integer,
       updated_at timestamp,
       account_type varchar(40)
);

create table if not exists t_brand (
       id bigserial primary key,
       brand_name varchar(400),
       status varchar(40),
       owner_account_id integer,
       created_at timestamp,
       updated_at timestamp
);

create table if not exists t_shop (
       id bigserial primary key,
       shop_name varchar(400),
       owner_account_id integer,
       brand_id integer,
       created_at timestamp,
       updated_at timestamp
);

create table if not exists t_organization (
       id bigserial primary key,
       organization_name varchar(400),
       created_at timestamp,
       updated_at timestamp
);

create table if not exists t_mechanism (
       id bigserial primary key,
       mechanism_name varchar(400),
       organization_id integer,
       shop_id integer,
       created_at timestamp,
       updated_at timestamp
);

create table if not exists t_category (
       id bigserial primary key,
       category_name varchar(400),
       created_at timestamp,
       updated_at timestamp
);

create table if not exists t_coupon_template (
       id bigserial primary key,
       coupon_template_name varchar(400),
       data json,
       status varchar(40),
       origin varchar(400),
       created_at timestamp,
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
       created_at timestamp,
       updated_at timestamp
);

create table if not exists t_coupon_instance (
       id bigserial primary key,
       coupon_instance_name varchar(400),
       data json,
       status varchar(40),
       template_instance_id integer,
       organization_id integer,
       created_at timestamp,
       updated_at timestamp
);

create table if not exists t_coupon_consumption (
       id bigserial primary key,
       coupon_instance_id integer,
       organization_id integer,
       account_consumer_id integer,
       account_clerk_id integer,
       latitude double precision,
       longitude double precision,
       created_at timestamp,
       updated_at timestamp
);
