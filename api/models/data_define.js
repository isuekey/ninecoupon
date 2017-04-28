var Sequelize = require('../../config/database/sequelize').Sequelize;
var sequelize = require('../../config/database/sequelize').sequelize;


var DomainAccount = sequelize.define('t_account', {
    name:{
        type:Sequelize.STRING
    },
    phone:{
        type:Sequelize.STRING
    },
    gender:{
        type:Sequelize.STRING
    },
    avatar:{
        type:Sequelize.STRING
    },
    createAt:{
        type:Sequelize.DATE,
        field:"create_at"
    },
    status:{
        type:Sequelize.STRING
    },
    promoter:{
        type:Sequelize.STRING
    },
    accountType:{
        type:Sequelize.STRING,
        field:"account_type"
    }
});

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
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING
    },
    origin:{
        type:Sequelize.STRING
    },
    createAt:{
        type:Sequelize.DATE,
        field:"create_at"
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

var DomainCouponTemplateInstance = sequelize.define("t_coupon_template_instance", {
    name:{
        type:Sequelize.STRING
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
        field:"coupon_template_id"
    },
    brandId:{
        type:Sequelize.INTEGER,
        field:"brand_id"
    },
    createAt:{
        type:Sequelize.DATE,
        field:"create_at"
    }
});

var DomainCouponInstance = sequelize.define("t_coupon_instance", {
    name:{
        type:Sequelize.STRING
    },
    data:{
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING
    },
    templateInstanceId:{
        type:Sequelize.INTEGER,
        field:"coupon_template_instance_id"
    },
    oranizationId:{
        type:Sequelize.INTEGER,
        field:"organization_id"
    },
    createAt:{
        type:Sequelize.DATE,
        field:"create_at"
    }
});

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
        field:"create_at"
    }
});


//exports.Visitor = Visitor;
exports.DomainAccount = DomainAccount;

exports.DomainCouponTemplate = DomainCouponTemplate;
