Guard Dog -v1.0.0
===================
![enter image description here](https://raw.githubusercontent.com/rajithadon/guarddog/master/guarddog-logo.jpg)
**npm        install    guarddog**
[https://www.npmjs.com/package/guarddog][8]

A **middleware** mainly for **expressjs** to validate and filter out unwanted API requests and, to define an **expected schema** with data types for JSON objects.

Architecture
-------------
Node.JS APIs are mostly designed to receive http requests with JSON objects. Almost always there is an expected object schema for that particular API.    

> **Note:**

> - Even though the API is secured using a tokening mechanism , attacker can obtain a token , he can inject the server code with unnecessary API requests .
> - Attacker can do minor changes to JSON payloads and attack directly in to your code and it may give valid results from the backend.
> - Running unexpected objects all over the application can cause unhandled exceptions and in unexpected places 
#### <i class="icon-file"></i> Example

> **Expected object :-**
>  **{** credentials: **{** username: "John" , password :"1234"**}}**
>  
>  **Actual Object** 
>   **{** cred: **{** username: "John" , password :"1234"**}}**

> **var username = object.credentials.username ;**
> This code will  return an error saying, **cannot read property username of null**.

#### <i class="icon-file"></i> Solution
```sequence
Front End->Body Parser: http request
Body Parser-->Guarddog: parsed object
Guarddog--> Router:valid output
Router->Front End: response
```

How to use
-------------
#### 1. Install the NPM package Guarddog 

You can install the npm using following command in your project,

[npm    install --save guarddog][8]
>As a prerequisite ,a body parser has to be used.  If you haven't any, you can install by 
>npm install  --save body-parser

----------


#### 2.  Require Guarddog in your project

var bodyParser =  require('body-parser');
var **guardDog**=require('guarddog');


----------


#### 3.  Define a strategy for Guarddog

> guardDog.**setStratergyJson**(stratergyJson);



stratergyJson should have 2 major properties. 

 - **apis** : expected api schema
 - **onFail**: fail event  ( this function will be called in case of a mismatch)

Sample object :

var stratergyJson={
    
    onFail:function(msg){
        console.log("Failure : ",msg)
    },
    apis:{
        "/user/token":{
            POST:{
                body:[{
                        "credentials":{
                            "username":"string",
                            "password":"string"
                        }
                    },
                    {
                        "details":{
                            "age":"number",
                            "address":"string",
                            "code":"number",
                            "hobbies":"array"
                        }
                    }

                ],
              

            }
        }
    }

};

Here in this explanation , **multiple body schemes** are passed to body property of the "/user/token" api. Such scenarios you can use an object array to define multiple objects.

> **Data types:** Datatype should be given as values for the leaf nodes of json object. In above example, username is an string , age is a number and hobbies is an array. list of supporting data types are
> 

 > - string
 > - number
 > - array 
 
> **Method types:** currently Guarddog  supports below methods only

> - GET
> - POST
> - PUT 
> - DELETE
> - PATCH


----------


#### 3.  Put the guarddog to guard
Here as a prerequisite ,**stratergy should be set and the request should be parsed by a body parser as a must before it reaches the guarddog middleware** . (since guarddog expects a body property in the request)

> guardDog.setStratergyJson(stratergyJson);
> 
> app.use(bodyParser.json());
> app.user(guardDog.guard)


Please feel free to point out issues in  [github issues of guarddog][7] . 
Gurddog 2.0.0 is under development and will be released soon.
Author
-------------
Don Rajitha Dissanayake
rajithadon@gmail.com
  [7]:https://github.com/rajithadon/guarddog/issues
  [8]: https://www.npmjs.com/package/guarddog
 
