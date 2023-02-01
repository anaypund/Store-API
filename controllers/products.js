const Product= require('../models/product')

const getAllProductsStatic= async (req,res)=>{
    const products =await Product.find({featured:true})
    res.status(200).json({products, nbHits:products.length})
}
const getAllProducts= async (req,res)=>{
    const queryObject={}
    const {featured,company,name, sort, field, numericFilters}= req.query
    if (featured) {
        queryObject.featured= featured=== 'true' ? true : false
    }
    if (company) {
        queryObject.company= company
    }
    if (name) {
        queryObject.name= {$regex: name, $options:'i'}
    }
    if (numericFilters) {
        operatorMap={
            ">":'$gt',
            "<":'$lt',
            "=":'$eq',
            "<=":'$lte',
            ">=":'$gte',
        }
        regEx=/\b(<|>|>=|=|<|<=)\b/g
        filters=numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        options=['price', 'rating']
        filters=filters.split(',').forEach((item) => {
            const [field,operator,value]=item.split('-')
            if(options.includes(field)){
                queryObject[field]={[operator]:Number(value)}
            }
        })

    }
    let result =Product.find(queryObject)
    //sort
    if(sort){
        const sortList=sort.split(',').join(' ')
        result=result.sort(sortList)
    }else{
        result = result.sort('createdAt')
    }

    //field
    if(field){
        const fieldsList=field.split(',').join(' ')
        result=result.select(fieldsList)
    }

    const page=Number(req.query.page)|| 1
    const limit=Number(req.query.limit)||10
    const skip=(page-1)*limit
    result=result.skip(skip).limit(limit)
    
    const products =await result
    res.status(200).json({products, nbHits:products.length})
}

module.exports={
    getAllProducts,
    getAllProductsStatic
}