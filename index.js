var isError=false;
var errorMessage=null;

function setError(status,message){
    isError=status;
    errorMessage=message;
}

function errorScenario(message){
    if(message){
        setError(true,message);
    }
    return false;
}



function getType(val){
    if(typeof(val)!=="object"){
        return typeof(val);
    }

    //if its an object
    if(val===null){
        return "null";
    }else if(val===undefined){
        return "undefined";
    }else if(Array.isArray(val)){
        return "array";
    }else{
        return "object"
    }

}

function recursiveJson(body,stratergyObject){
    for(var key in stratergyObject){
        if(body[key]){
            if(getType(body[key]) !== "object" && getType(stratergyObject[key]) !=="object"){
                 return onSuccessKeyMatch(key);
            }else if(getType(body[key]) !== "object" && getType(stratergyObject[key]) ==="object" ){
                //body leaf vs stratergy object
                return errorScenario(key +" in stratergy is an object and in request its "+getType(body[key]));

            }else if(getType(body[key]) === "object" && getType(stratergyObject[key]) !=="object" ){

                //body object vs stratergy leaf
                return errorScenario(key+" in request is an object and its a "+getType(stratergyObject[key])+"in stratergy");
            }
            
            //if body[key]=== object && stratergyObject[key] === object
            recursiveJson(body[key],stratergyObject[key]);
            
        }else{
            return errorScenario("key mismatch in:"+key);
        }
    }

    return true;

    function onSuccessKeyMatch(key){
       if(getType(body[key]) === stratergyObject[key]){
           return true;
       }else{
           return errorScenario("type mismatch in :"+key);
       }
    }
}

function isBodyExist(method){
    var methodBodyStatus={
        "POST":true,
        "PUT":true,
        "GET":false,
        "DELETE":true,
        "PATCH":true,
    }
    return methodBodyStatus[method];
}

var guardDog={
    "guard":function(req,res,next){

        if(!req || !req.originalUrl){
            return errorScenario("problem in request");
        }

        if(!req.method){
            return errorScenario("no method found in the request");
        }

        var stratergyInstance=stratergyJson.apis[req.originalUrl];

        if(!stratergyInstance || !stratergyInstance[req.method]){
            return errorScenario("no stratergy defined for api method");
        }

        if((stratergyInstance && isBodyExist(req.method)) && (req.body && stratergyInstance[req.method].body)){
            recurseThroughInstance();
        }

        function recurseThroughInstance(){
            if(Array.isArray(stratergyInstance[req.method].body)){
                iteration();
            }else{
                recursiveJson(req.body,stratergyInstance[req.method].body);
            }

            function iteration(){
                for(var i=0;i<stratergyInstance[req.method].body.length;i++){
                    setError(false,null);
                    recursiveJson(req.body,stratergyInstance[req.method].body[i]);
                    if(isError==false){
                        break;
                    }
                }
            }
        }
        

        if(isError){
            stratergyJson.onFail(errorMessage);
        }else{
            next();
        }
        
    },
    "setStratergyJson":function(jsonObject){
        stratergyJson=jsonObject;
    }
}     

module.exports=guardDog;

