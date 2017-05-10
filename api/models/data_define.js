var Sequelize = require('../../config/database/sequelize').Sequelize;
var sequelize = require('../../config/database/sequelize').sequelize;
var bluebird = require('bluebird');
var redisdb = require('redis');
var redis = redisdb.createClient();
bluebird.promisifyAll(redisdb.RedisClient.prototype);
bluebird.promisifyAll(redisdb.Multi.prototype);

var formats = {
    user: 'users:',
    token: "tokens:"
};
var redisKey = function redisKey(key, keyValue){
    return `${key}${keyValue}`;
};

var DomainAccount = sequelize.define('t_account', {
    account:{
        type:Sequelize.STRING
    },
    accountName:{
        type:Sequelize.STRING,
        field:"account_name"
    },
    phone:{
        type:Sequelize.STRING
    },
    gender:{
        type:Sequelize.INTEGER
    },
    avatar:{
        type:Sequelize.STRING
    },
    password:{
        type:Sequelize.STRING
    },
    createAt:{
        type:Sequelize.DATE,
        field:"created_at"
    },
    status:{
        type:Sequelize.STRING
    },
    promoter:{
        type:Sequelize.INTEGER
    },
    accountType:{
        type:Sequelize.STRING,
        field:"account_type"
    }
});
DomainAccount.findReidsAccount = function findReidsAccount(newAccount){
    let userKey = redisKey(formats.user, newAccount.account);
    let getUser = redis.hgetallAsync(userKey);
    return getUser;
};
DomainAccount.signUpAccount = function signUpAccount(newAccount){
    let userKey = redisKey(formats.user, newAccount.account);
    return redis.hmsetAsync(userKey, newAccount)
        .then(()=>{
            return this.findOrCreate({
                where:{
                    account:newAccount.account
                },
                defaults: newAccount
            });
        });
    
};
DomainAccount.signInAccount = function signInAccount(login){
    return this.findOne({
        where:{
            account:login.account,
            password:login.password
        }
    });
};
DomainAccount.testPhoneExist = function testPhoneExist(phone){
    return this.findOne({
        where:{
            phone:phone
        }
    });
};

var DomainBrand = sequelize.define('t_brand', {
    name:{
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING
    },
    createAt:{
        type:Sequelize.DATE,
        field:"create_at"
    },
    owner:{
        type:Sequelize.INTEGER
    }
});
DomainBrand.belongsTo(DomainAccount);


var DomainShop = sequelize.define("t_shop", {
    name:{
        type:Sequelize.STRING
    },
    createAt:{
        type:Sequelize.DATE,
        field:"create_at"
    },
    owner:{
        type:Sequelize.INTEGER
    },
    brand:{
        type:Sequelize.INTEGER
    }
});
DomainShop.belongsTo(DomainAccount);
DomainShop.belongsTo(DomainBrand);

//++ 发行优惠券的时候的虚拟组织 begin
var DomainOrganization = sequelize.define("t_organization", {
    name:{
        type:Sequelize.STRING
    }
});
var DomainMechanism = sequelize.define("t_mechanism", {
    name:{
        type:Sequelize.STRING
    },
    organization:{
        type:Sequelize.INTEGER
    },
    shop:{
        type:Sequelize.INTEGER
    }
});
//-- 发行优惠券的时候的虚拟组织 begin
var DomainCategory = sequelize.define("t_coupon_category", {
    name:{
        type:Sequelize.STRING
    }
});
var DomainCouponTemplate = sequelize.define("t_coupon_template", {
    name:{
        type:Sequelize.STRING
    },
    data:{
        type:Sequelize.JSON
    },
    status:{
        type:Sequelize.STRING
    },
    origin:{
        type:Sequelize.STRING
    },
    createAt:{
        type:Sequelize.DATE,
        field:"created_at"
    }
});
DomainCategory.hasMany(DomainCouponTemplate, { constraints: false});
DomainCouponTemplate.belongsTo(DomainCategory);
DomainCouponTemplate.queryCouponTemplate = function queryCouponTemplate(templateStatus, templateType, templateOrigin){
    var where = {};
    if(templateStatus){
        where.status = templateStatus;
    };
    if(templateType){
        where.type = templateType;
    };
    if(templateOrigin){
        where.origin = templateOrigin;
    };
    return this.findAll({
        where
    });
};
DomainCouponTemplate.createCouponTemplate = function createCouponTemplate(newCouponTemplate){
    return this.findOrCreate({
        where:{
            name:newCouponTemplate.name,
            data:newCouponTemplate.data
        },
        defaults: newCouponTemplate
    });
};
DomainCouponTemplate.findCouponTemplateById = function findCouponTemplateById(couponTemplateId){
    return this.findById(couponTemplateId);
};

var DomainCouponTemplateInstance = sequelize.define("t_coupon_template_instance", {
    name:{
        type:Sequelize.STRING,
        field:"coupon_template_instance_name"
    },
    data:{
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING
    },
    publishType:{
        type:Sequelize.STRING,
        field:"publish_type"
    },
    templateId:{
        type:Sequelize.INTEGER,
        field:"template_id"
    },
    brandId:{
        type:Sequelize.INTEGER,
        field:"brand_id"
    },
    createAt:{
        type:Sequelize.DATE,
        field:"created_at"
    }
});
DomainCouponTemplateInstance.queryCouponTemplateInstance = function queryCouponTemplateInstance(){
    return this.findAll();
};
DomainCouponTemplateInstance.createCouponTemplateInstance = function createCouponTemplateInstance(newCouponTemplateInstance){
    return this.findOrCreate({
        where:{
            name:newCouponTemplateInstance.name,
            data:newCouponTemplateInstance.data,
            brandId:newCouponTemplateInstance.brandId
        },
        defaults: newCouponTemplateInstance
    });
};
DomainCouponTemplateInstance.deleteCouponTemplateInstance = function deleteCouponTemplateInstance(couponTemplateInstanceId){
    return this.update({ status:"disabled" }, { where:{ id: couponTemplateInstanceId } });
};
DomainCouponTemplateInstance.getCouponTemplateInstanceById = function getCouponTemplateInstanceById(couponTemplateInstanceId){
    return this.findById(couponTemplateInstanceId);
};

var DomainCouponInstance = sequelize.define("t_coupon_instance", {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        field:"id"
    },
    name:{
        type:Sequelize.STRING,
        field:'coupon_instance_name'
    },
    data:{
        type:Sequelize.JSON
    },
    status:{
        type:Sequelize.STRING
    },
    templateInstanceId:{
        type:Sequelize.INTEGER,
        field:"template_instance_id"
    },
    organizationId:{
        type:Sequelize.INTEGER,
        field:"organization_id"
    },
    createAt:{
        type:Sequelize.DATE,
        field:"created_at"
    }
});
DomainCouponInstance.createCouponInstanceFromTemplate = function createCouponInstanceFromTemplate(couponTemplateInstance){
    //TODO 根据模版实例创建优惠券
    console.log(couponTemplateInstance);
    let records = [];
    let data = couponTemplateInstance.data;
    let counts = couponTemplateInstance.data.count;
    for (let index = 0; index < counts; ++index){
        records.push({
            name: couponTemplateInstance.name,
            data : data,
            status: 'enabled',
            templateInstanceId: couponTemplateInstance.id
        });
    };
    console.log(records);
    return this
        .bulkCreate(records, {
            fields:['name', 'data', 'status', 'templateInstanceId']
        });
    
};
DomainCouponInstance.queryNineCouponInstanceForUser = function queryNineCouponInstanceForUser(appUserId){
    //TODO 给某个用户获取九张优惠券
    return this.findAll({
        limit:9
    });
};
DomainCouponInstance.takeOffTheCouponInstance = function takeOffTheCouponInstance(appUserId, couponInstance){
    //TODO 用户领取优惠券
    return this.findAll({});
};
var DomainCouponConsumption = sequelize.define("t_coupon_consumption", {
    couponInstanceId:{
        type:Sequelize.INTEGER,
        field:"coupon_instance_id"
    },
    oranizationId:{
        type:Sequelize.INTEGER,
        field:"organization_id"
    },
    consumerId:{
        type:Sequelize.INTEGER,
        field:"account_consumer_id"
    },
    clerkId:{
        type:Sequelize.INTEGER,
        field:"account_clerk_id"
    },
    latitude:{
        type:Sequelize.DOUBLE,
        field:"latitude"
    },
    longitude:{
        type:Sequelize.DOUBLE,
        field:"longitude"
    },
    createAt:{
        type:Sequelize.DATE,
        field:"created_at"
    }
});
DomainCouponConsumption.writeOffTheCouponInstance = function writeOffTheCouponInstance(couponInstanceId, couponDetail){
    let defaultValue = {
        "couponInstanceId": couponInstanceId,
        "clerkId": couponDetail.clerk.id
    };
    return this.findOrCreate({
        where:{
            "coupon_instance_id":couponInstanceId
        },
        defaults: defaultValue
    });
};
DomainCouponConsumption.queryCouponInstanceOfUser = function queryCouponInstanceOfUser(appUserId){
    //TODO 获取用户现有的优惠券的状态
};
DomainCouponConsumption.queryCoupontWritenOffByTheUser = function queryCoupontWritenOffByTheUser(appClerkId){
    let sql = `
    select consumption.id
    ,instance.id as instance_id, instance.coupon_instance_name, instance.data as instance_data, instance.template_instance_id
    ,clerk.id as clerk_id, clerk.account as clerk_account, clerk.account_name as clerk_name, clerk.phone as clerk_phone
    ,clerk.avatar as clerk_avatar, clerk.account_type as clerk_account_type
    from t_coupon_consumption as consumption left join t_coupon_instance as instance on consumption.coupon_instance_id = instance.id
    left join t_account as clerk on consumption.account_clerk_id = clerk.id
    left join t_account as consumer on consumption.account_consumer_id = consumer.id
    where clerk.id = ${appClerkId}
    `;
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
        .then( (arrayInstance) =>{
            return arrayInstance.map( (ele) =>{
                return {
                    id: parseInt(ele['id']),
                    couponInstance:{
                        id: parseInt(ele['instance_id']),
                        data: ele['instance_data'],
                        name: ele['coupon_instance_name']
                    },
                    clerk:{
                        id: parseInt(ele['clerk_id']),
                        account: ele['clerk_account'],
                        accountName: ele['clerk_name'],
                        phone: ele['clerk_phone'],
                        avatar: ele['clerk_avatar'] || '',
                        accountType: ele['clerk_account_type']
                    }
                };
            });
        });
};


//exports.Visitor = Visitor;
exports.DomainAccount = DomainAccount;

exports.DomainCouponTemplate = DomainCouponTemplate;

exports.DomainCouponInstance = DomainCouponInstance;

exports.DomainCouponConsumption = DomainCouponConsumption;


