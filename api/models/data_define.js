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
        type:Sequelize.INTEGER,
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
DomainAccount.getAccountInfo = function getAccountInfo(authUser){
    return this.findOne({
        where:{
            account:authUser.id
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


var DomainAccountRelation = sequelize.define("t_account_relation", {
    parent:{
        type: Sequelize.BIGINT
    },
    account: {
        type: Sequelize.STRING
    },
    accountName:{
        type: Sequelize.STRING,
        field: "account_name"
    },
    status:{
        type: Sequelize.STRING
    },
    relationType:{
        type: Sequelize.STRING,
        field: "relation_type"
    },
    shop: {
        type: Sequelize.BIGINT,
        field: "shop_id"
    }
});
/**
 * 查询自己的店员有哪些
 */
DomainAccountRelation.queryMyClerkList = function queryMyClerkList(authUser){
    return this.findAll({
        where:{
            parent: authUser.id,
            relationType: "clerks"
        }
    });
};
DomainAccountRelation.queryMyClerkListInTheShop = function queryMyClerkListInTheShop(authUser, shopId){
    return this.findAll({
        where:{
            parent: authUser.id,
            relationType: "clerks",
            shop: shopId
        }
    }).then((arrayInstance) =>{
        return arrayInstance.map((ele)=>{
            return ele.toJSON();
        });
    });
};
DomainAccountRelation.disableMyClerk = function disableMyClerk(authUser, theClerkId){
    return this.update({status:"disabled"}, {
        where:{
            parent: authUser.id,
            id: theClerkId,
            relation_type: "clerks"
        }
    });
};
DomainAccountRelation.addMyClerk = function addMyClerk(authUser, theClerk){
    return this.findOrCreate({
        where: {
            parent: authUser.id,
            account: theClerk.account,
            relation_type:"clerks",
            shop: theClerk.shop
        },
        defaults: {
            parent: authUser.id,
            account: theClerk.account,
            accountName: theClerk.accountName,
            status: "enabled",
            relationType:"clerks",
            shop: theClerk.shop
        }
    });
};

var DomainArea = sequelize.define('t_area', {
    name:{
        type:Sequelize.STRING,
        field: "area_name"
    },
    areaIndex:{
        type:Sequelize.STRING,
        field: "area_index"
    },
    status:{
        type:Sequelize.STRING
    },
    latitude:{
        type:Sequelize.DOUBLE
    },
    longitude:{
        type:Sequelize.DOUBLE
    }
});

DomainArea.randomAreaCoupon = function randomAreaCoupon(authUser, areaIndex){
    let sql = `select template.id, template.coupon_template_name as templateName, template.data,
        template.strategy_id as strategyId,
        template.shop_id as shopId,
        template.origin as orign,
        shop.shop_name as shopName
    from t_shop as shop, t_coupon_template as template
    where shop.area_index = '${areaIndex}' and shop.id = template.shop_id
    and template.status = 'enabled'
    and template.end_time > current_timestamp
    and template.publish > 500
    `;
    return sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then( arrayInstance => {
        let max = arrayInstance.length;
        let returnArrayInstance = [];
        if(arrayInstance.length> 0)for(let count = 0; count < 9; ++count){
            let index = Math.floor(Math.random() * max);
            let instance = arrayInstance[index];
            returnArrayInstance.push(arrayInstance[index]);
        };
        return returnArrayInstance;
    });
};

DomainArea.queryAreaList = function queryAreaList(){
    return this.findAll({}).then( arrayInstance =>{
        return arrayInstance.map( ele => ele.toJSON() );
    });
};
DomainArea.addNewArea = function addNewArea(areaInfo){
    return this.findOrCreate({
        where:{
            areaIndex: areaInfo.areaIndex
        },
        defaults:{
            name: areaInfo.name,
            areaIndex: areaInfo.areaIndex,
            status: areaInfo.status,
            latitude: areaInfo.latitude,
            longitude: areaInfo.longitude
        }
    }).then( (arrayInstance, created) =>{
    });
};

var DomainShop = sequelize.define("t_shop", {
    name:{
        type:Sequelize.STRING,
        field:"shop_name"
    },
    ownerId:{
        type:Sequelize.BIGINT,
        field:"owner_account_id"
    },
    owner:{
        type:Sequelize.STRING,
        field:"owner_account"
    },
    area:{
        type:Sequelize.INTEGER,
        field:"area_id"
    },
    areaIndex:{
        type:Sequelize.STRING,
        field:"area_index"
    }
});

DomainShop.queryMyShopList = function queryMyShopList(authUser){
    return this.findAll({
        where:{
            owner: authUser.id
        }
    }).then((arrayInstance)=>{
        return arrayInstance.map( ele => ele.toJSON());
    });
};
DomainShop.queryShopOfTheArea = function queryShopOfTheArea(areaIndex){
    return this.findAll({
        where:{
            areaIndex: areaIndex
        }
    }).then((arrayInstance)=>{
        return arrayInstance.map( ele => ele.toJSON());
    });
};
DomainShop.addNewShopOfTheArea = function addNewShopOfTheArea(newShop){
    return this.findOrCreate({
        where:{
            name: newShop.name,
            owner: newShop.owner,
            areaIndex: newShop.areaIndex
        },
        defaults:{
            name: newShop.name,
            owner: newShop.owner,
            areaIndex: newShop.areaIndex
        }
    });
};
DomainShop.queryMyShopWorkList = function queryMyShopWorkList(authUser){
    let sql = `
    select shop.id, shop.shop_name as shopname,shop.owner_account_id as ownerid,
    shop.owner_account as owneraccount, shop.area_id as areaid,
    shop.area_index as areaindex
    from t_shop as shop, t_account_relation as relation
    where shop.id = relation.shop_id
    and relation.account = '${authUser.id}';`;
    return sequelize.query(sql, {type: sequelize.QueryTypes.SELECT});

};
var DomainCouponStrategy = sequelize.define("t_coupon_strategy", {
    strategyName:{
        type:Sequelize.STRING,
        field:"strategy_name"
    },
    data:{
        type:Sequelize.JSON
    },
    status:{
        type:Sequelize.STRING
    },
    origin:{
        type:Sequelize.STRING
    }
});

DomainCouponStrategy.addNewStrategy = function addNewStrategy(strategy){
    return this.findOrCreate({
        where:{
            strategyName: strategy.strategyName,
            origin: strategy.origin
        },
        defaults:{
            strategyName: strategy.strategyName,
            origin: strategy.origin,
            data: strategy.data,
            status: "enabled"
        }
    });
};
DomainCouponStrategy.queryStrategyList = function queryStrategyList(){
    return this.findAll().then((arrayInstance)=>{
        return arrayInstance.map( ele => ele.toJSON() );
    });
};

var DomainCouponStrategyAccess = sequelize.define("t_coupon_strategy_access", {
    strategyId:{
        type:Sequelize.BIGINT,
        field:"strategy_id"
    },
    shopId:{
        type:Sequelize.BIGINT,
        field:"shop_id"
    },
    status:{
        type:Sequelize.STRING
    }
});

DomainCouponStrategyAccess.queryStrategyAccessedOfTheShop = function queryStrategyAccessedOfTheShop(shopId){
    let sql = `
    select strategy.id as strategy_id, strategy.strategy_name, strategy.data, strategy.origin, strategy.status as strategy_status,
    access.id as access_id, access.status as access_status, access.shop_id
    from t_coupon_strategy as strategy, t_coupon_strategy_access as access, t_shop as shop
    where strategy.id = access.strategy_id and access.shop_id = shop.id
    and strategy.status = 'enabled'
    and shop.id = ${shopId}
    `;
    return sequelize.query(sql, {type: sequelize.QueryTypes.SELECT})
        .then( (arrayInstance) =>{
            return arrayInstance;
        });
};
DomainCouponStrategyAccess.addNewStrategyAccess = function addNewStrategyAccess(access){
    return this.findOrCreate({
        where:{
            strategyId: access.strategyId,
            shopId: access.shopId
        },
        defaults:{
            strategyId: access.strategyId,
            shopId: access.shopId,
            status:"enabled"
        }
    });
};
var DomainCouponTemplate = sequelize.define("t_coupon_template", {
    name:{
        type:Sequelize.STRING,
        field:'coupon_template_name'
    },
    data:{
        type:Sequelize.JSON
    },
    strategyId:{
        type:Sequelize.BIGINT,
        field: "strategy_id"
    },
    shopId:{
        type:Sequelize.BIGINT,
        field: "shop_id"
    },
    status:{
        type:Sequelize.STRING
    },
    origin:{
        type:Sequelize.STRING
    },
    maxcount:{
        type:Sequelize.INTEGER
    },
    beginTime:{
        type:Sequelize.DATE,
        field:"begin_time"
    },
    endTime:{
        type:Sequelize.DATE,
        field:"end_time"
    },
    publish:{
        type: Sequelize.INTEGER
    }
});

DomainCouponTemplate.generateTemplateByStrategy = function generateTemplateByStrategy(authUser, accessStrategy){
    return this.findOrCreate({
        where:{
            strategyId:accessStrategy.strategyId,
            shopId: accessStrategy.shopId,
            data: accessStrategy.data
        },
        defaults:{
            name: accessStrategy.name,
            data: accessStrategy.data,
            strategyId:accessStrategy.strategyId,
            shopId: accessStrategy.shopId,
            status: "enabled",
            origin: "suyuan",
            maxcount: accessStrategy.maxcount,
            beginTime: accessStrategy.beginTime,
            endTime: accessStrategy.endTime,
            publish: accessStrategy.publish
        }
    }).then((arrayInstance, created)=>{
        let result = arrayInstance[0].toJSON();
        return Promise.all(result, created);
    });
};

DomainCouponTemplate.queryShopTemplateList = function queryShopTemplateList(authUser, shopId){
    return this.findAll({
        where:{
            shopId:shopId
        }
    }).then( (arrayInstance)=>{
        return arrayInstance.map((ele)=>{
            return ele.toJSON();
        });
    });
};

DomainCouponTemplate.publishShopTemplate = function publishShopTemplate(authUser, templateId){
    return this.update({publish:1000}, {
        where:{ id: templateId }
    });
};

var DomainCouponInstance = sequelize.define("t_coupon_instance", {
    name:{
        type:Sequelize.STRING,
        field:'coupon_instance_name'
    },
    data:{
        type:Sequelize.JSON
    },
    accountId:{
        type:Sequelize.BIGINT,
        field: "account_id"
    },
    account:{
        type:Sequelize.STRING
    },
    accountName:{
        type:Sequelize.STRING,
        field: "account_name"
    },
    status:{
        type:Sequelize.STRING
    },
    templateId:{
        type:Sequelize.BIGINT,
        field:"template_id"
    },
    shopId:{
        type:Sequelize.BIGINT,
        field:"shop_id"
    },
    randomId:{
        type:Sequelize.INTEGER,
        field:"random_id"
    }
});

DomainCouponInstance.queryUserCoupon = function queryUserCoupon(authUser){
    return this.findAll({
        where:{
            account: authUser.id
        }
    }).then( (arrayInstance)=>{
        return arrayInstance.map((ele) =>{
            return ele.toJSON();
        });
    });
};

DomainCouponInstance.generateCouponFromTemplate = function generateCouponFromTemplate(authUser, couponTemplate){
    return this.findOrCreate({
        where:{
            account: authUser.id,
            randomId: couponTemplate.randomId,
            templateId: couponTemplate.templateId
        },
        defaults:{
            name: couponTemplate.name,
            data: couponTemplate.data,
            account: authUser.id,
            stauts: "enabled",
            templateId: couponTemplate.templateId,
            shopId: couponTemplate.shopId,
            randomId: couponTemplate.randomId
        }
    });
};

var DomainCouponConsumption = sequelize.define("t_coupon_consumption", {
    instanceId:{
        type:Sequelize.BIGINT,
        field:"coupon_instance_id"
    },
    shopId:{
        type:Sequelize.BIGINT,
        field:"shop_id"
    },
    consumerId:{
        type:Sequelize.BIGINT,
        field:"account_consumer_id"
    },
    consumer:{
        type:Sequelize.STRING,
        field:"account_consumer"
    },
    clerkId:{
        type:Sequelize.BIGINT,
        field:"account_clerk_id"
    },
    clerk:{
        type:Sequelize.STRING,
        field:"account_clerk"
    },
    latitude:{
        type:Sequelize.DOUBLE,
        field:"latitude"
    },
    longitude:{
        type:Sequelize.DOUBLE,
        field:"longitude"
    }
});

DomainCouponConsumption.queryMyWriteOffInTheShop = function queryMyWriteOffInTheShop(authUser, shopId){
    return this.findAll({
        where:{
            clerk: authUser.id,
            shopId
        }
    }).then( (instanceArray) =>{
        return instanceArray.map( ele => ele.toJSON() );
    });
};

DomainCouponConsumption.writeOffCoupon = function writeOffCoupon(authUser, coupon){
    return this.findOrCreate({
        where:{
            instanceId: coupon.instanceId
        },
        defaults:{
            instanceId: coupon.instanceId,
            shopId: coupon.shopid,
            consumer: coupon.consumer,
            clerk: authUser.id
        }
    });
};


//exports.Visitor = Visitor;
exports.DomainAccount = DomainAccount;
exports.DomainAccountRelation = DomainAccountRelation;
exports.DomainCouponStrategyAccess = DomainCouponStrategyAccess;
exports.DomainCouponTemplate = DomainCouponTemplate;
exports.DomainCouponInstance = DomainCouponInstance;
exports.DomainCouponConsumption = DomainCouponConsumption;
exports.DomainArea = DomainArea;
exports.DomainShop = DomainShop;
exports.DomainCouponStrategy = DomainCouponStrategy;
