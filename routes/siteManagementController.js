const Header = require('../models/headerModel')
const Footer = require('../models/footerModel')
const Banner = require("../models/bannerModel")
 const NewsLetter = require("../models/newsLetterModel")
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// header CURD 
exports.createHeader = (req,res)=>{
    try{
        const body = req.body
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "Data Not Proper Formated..." });
          }
         const header = new Header(body);
         header.save().then(headerInfo =>{
             if(!headerInfo){
                 res.status(400).send({
                     message:"header not created !",
                     headerData : headerInfo
                 })
             }else{
                 res.status(200).send({
                     message:"header created succusfully !",
                     headerData:headerInfo
                 })
             }
             
             }).catch(error =>{
             res.status(400).send({
                 message:"header not created !",
                 subError:error.message
             })
         })
    }catch(error){
        res.status(400).send({
            message:"Oops ! something went wrong in create herder",
            subError:error.message
        })
    }
   

}
exports.getHeaderById = (req,res)=>{
    try{
        const headerid = req.query.headerid
        if (!ObjectId.isValid(headerid) && !ObjectId(headerid)) {
            res.status(400).send({ message: "user id not valid" });
          }else{
            Header.findById(headerid).then(headerData=>{
                if(!headerData){
                    res.status(400).send({
                        message:"header not found",
                    })
                }else{
                    res.status(200).send({
                        message:"header Data",
                        headerData:headerData
                    })
                }
        }).catch(error=>{
            res.status(400).send({
                message:"header not found",
                subError:error.message
            })
           })
          }
      }catch(error){
        res.status(400).send({
            message:"Oops try agin with header id",
            subError:error.message
        })
    }
    

}
exports.deleteHeaderById =(req,res)=>{
    try{
        const headerid = req.query.headerid
        if (!ObjectId.isValid(headerid) && !ObjectId(headerid)) {
            res.status(400).send({ message: "footer id not valid" });
          }else{
            Header.findByIdAndDelete(headerid,(error,deletedData)=>{
                if(error){
                    res.status(400).send({
                        message:"header not found",
                        subError:error.message
                    })
                }else{
                    res.status(200).send({
                        message:"header deleted Data",
                        headerData:deletedData
                    })
                }
            });
          }
      
    }catch(error){
        res.status(400).send({
            message:"Oops try agin with header id",
            subError:error.message
        })
    }
}
exports.updateHeader = (req,res)=>{
    try{
        
        const body = req.body;
        const headerUpdateData = {
            labelofheader:body.labelofheader,
            titleofcontent:body.titleofcontent,
            contentofpage:body.contentofpage
        }
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "body will not empty" });
          } 
        else if (!ObjectId.isValid(body._id) && !ObjectId(body._id)) {
            res.status(400).send({ message: "user id not valid" });
          }else{
            Header.findByIdAndUpdate({ _id: body._id },headerUpdateData,{ new: true },(error,updatedData)=>{
                if(error){
                    res.status(400).send({
                        message:"header not found",
                        subError:error.message
                    })
                }else{
                    res.status(200).send({
                        message:"header updated Data",
                        headerData:updatedData
                    })
                }
            });
          }
      
    }catch(error){
        res.status(400).send({
            message:"Oops try agin with header id",
            subError:error.message
        })
    }
}


//CURD footer
exports.createFooter = (req,res)=>{
    try{
        const body = req.body
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "body should not empty" });
          }else{
            const footer = new Footer(body);
            footer.save().then(footerInfo =>{
                if(!footerInfo){
                    res.status(400).send({
                        message:"footer not created !",
                        headerData : headerInfo
                    })
                }else{
                    res.status(200).send({
                        message:"footer created succusfully !",
                        footerData:footerInfo
                    })
                }
                
                }).catch(error =>{
                res.status(400).send({
                    message:"footer not created !",
                    subError:error.message
                })
            })  
          }
   
    }catch(error){
        res.status(400).send({
            message:"Oops ! something went wrong in create footer",
            subError:error.message
        })
    }
   

}

exports.getFooter = (req,res)=>{
    try{
        const footerValue = req.query.footerkey
      
        if(!footerValue){
            Footer.find().then(footerData =>{
                if(!footerData.length > 0){
                    res.status(400).send({
                        message :"no footer data found",
                        footerData:footerData
                    })
                }else{
                    res.status(400).send({
                        message :"footer data found",
                        footerData:footerData
                    })
                }
    
            }).catch(error=>{
                res.status(400).send({
                    message :"no data found",
                    subError:error.message
                })
            })
        }else{
            Footer.find({title:footerValue}).then(footerData =>{
                if(!footerData.length > 0){
                    res.status(400).send({
                        message : `no ${footerValue} footer data found`,
                        footerData:footerData
                    })
                }else{
                    res.status(200).send({
                        message : `${footerValue} footer data found`,
                        footerData:footerData
                    })
                }
    
            }).catch(error=>{
                res.status(400).send({
                    message :`no ${footerValue} footer data found`,
                    subError:error.message
                })
            })
        }

      }catch(error){
        res.status(400).send({
            message:"Oops something went wrong",
            subError:error.message
        })
    }
    

}

exports.deleteFooterById = (req,res)=>{
    try{
        const footerid = req.query.footerid
       
        if (!ObjectId.isValid(footerid) && !ObjectId(footerid)) {
            res.status(400).send({ message: "footer id not valid" });
          }else{
            if(!footerid){
                res.status(400).send({
                    message:"footer id is required"
                })
            }else{
                Footer.findByIdAndDelete(footerid,(error,deletedData)=>{
                    if(error){
                        res.status(400).send({
                            message:"footer data not found",
                            subError:error.message
                        })
                    }else{
                        if(!deletedData){
                            res.status(200).send({
                                message:"footer id not found",
                                footerData:deletedData
                            })
                            
                        }else{
                            res.status(200).send({
                                message:"footer deleted Data",
                                footerData:deletedData
                            })
                        }
                    }
                });
            }
            
          }
      
    }catch(error){
        res.status(400).send({
            message:"Oops try agin with header id",
            subError:error.message
        })
    }
}

exports.updateFooter = (req,res)=>{
    try{
        const body = req.body;
        const footerUpdateData = {
            title:body.title,
            labeloffooter:body.labeloffooter,
            titleoffooter:body.titleoffooter,
            contentofpage:body.contentofpage
        }
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "body will not empty" });
          } 
        else if (!ObjectId.isValid(body._id) && !ObjectId(body._id)) {
            res.status(400).send({ message: "footer id not valid" });
          }else{
            Footer.findByIdAndUpdate({ _id: body._id },footerUpdateData,{ new: true },(error,updatedData)=>{
                if(error){
                    res.status(400).send({
                        message:"footer not found",
                        subError:error.message
                    })
                }else{
                    res.status(200).send({
                        message:"footer updated Data",
                        headerData:updatedData
                    })
                }
            });
          }
      
    }catch(error){
        res.status(400).send({
            message:"Oops try agin with footer id",
            subError:error.message
        })
    }
}

// Banner api 
exports.createBanner = async (req,res)=>{
    try{
        let imagePath = "";
        let logo = "";
        if (req.files) {
            logo =req.files.logo[0].path
            imagePath = req.files.banner[0].path;
        }
        const banner = new Banner({
            logo: logo,
            title: req.body.title,
            description: req.body.description,
            banner: imagePath,
        });
      
        await banner.save().then((response) => {
            res.status(200).send({
                message:"banner created successfully !",
                bannerData : response
            });
          })
          .catch((error) => {
            res.status(400).send({ 
                message:"Banner not created !",
                subError : error.message
            });
          });
    }catch(error){
        res.status(400).send({ 
            message:"Banner not created !",
            subError : error.message
        });
    }
   
}
exports.getBanner = async(req,res)=>{
    try{
        const bannerid =req.query.bannerid;
        if (!ObjectId.isValid(bannerid) && !ObjectId(bannerid)) {
            res.status(400).send({ message: "banner id not valid" });
          }
        if(!bannerid){
            Banner.find().then(bannerData=>{
                console.log(bannerData.length)
                if(bannerData.length === 0 ){
                    res.status(400).send({
                        message:"banner data not found ",
                        subError : bannerData
                    })
                }else{
                    res.status(200).send({
                        message:"banner  Data",
                        bannerData:bannerData
                    })
                }
              
             }).catch(error =>{
                res.status(400).send({
                    message:"Oops ! something went wrong",
                    subError: error.message
                })
             })
        }else{
            Banner.findById({_id:bannerid}).then(bannerData=>{
                if(!bannerData){
                    res.status(400).send({
                        message:" banner is not there for this id ",
                        subError : bannerData
                    })
                }else{
                    res.status(200).send({
                        message:"banner Data",
                        bannerData:bannerData
                    })
                }
             }).catch(error =>{
                res.status(400).send({
                    message:"Oops ! something went wrong",
                    subError: error.message
                })
             })
        }
       
    }catch(error){
        res.status(400).send({
            message:"Oops ! something went wrong",
            subError: error.message
        })
    }
}

exports.updateBanner = async(req,res)=>{
    try{
        const body = req.body
        var bannerUpdateData = {
            banner: "",
            logo: "",
            title: "",
            description: "",
        }
        if (!ObjectId.isValid(body._id) && !ObjectId(body._id)) {
            res.status(400).send({ message: "banner id not valid" });
          }else{
             await Banner.findById(body._id).then(bannerInfo=>{
                  if(!bannerInfo){
                      res.status(400).send({
                          message:"banner data not found",
                          bannerData:bannerInfo
                      })
                  }else{
                    for(key in bannerUpdateData){
                        bannerUpdateData[key]  = bannerInfo[key]
                    } 
                    bannerUpdateData.title  = body.title || bannerInfo.title
                    bannerUpdateData.description  = body.description  || bannerInfo.description
                  }

                 
              }).catch(error=>{
                  res.status(400).send({
                      message:"banner not found",
                      subError:error.message
                  })
              })
          }
        if (req.files) {
            for(key in req.files){
                bannerUpdateData[key]  = req.files[key][0].path
            }     
        }
        
        if (Object.keys(body).length === 0 && body.constructor === Object) {
            res.status(400).send({ message: "body will not empty" });
          } 
        else{
            Banner.findByIdAndUpdate({ _id: body._id },bannerUpdateData,{ new: true },(error,updatedData)=>{
               
                if(error){
                    res.status(400).send({
                        message:"banner not found",
                        subError:error.message
                    })
                }else{
                    res.status(200).send({
                        message:"banner updated Data",
                        bannerData:updatedData
                    })
                }
            });
          }
    }catch(error){
        res.status(400).send({
            message:"Oops ! something went wrong in update banner",
            error:error,
            subError:error.message
        })
    }
}
exports.deleteBanner = async(req,res)=>{
    try{
        const bannerId = req.query.bannerid;
        if(!bannerId){
            res.status(400).send({ message: "banner id required" });
        }
        if (!ObjectId.isValid(bannerId) && !ObjectId(bannerId)) {
            res.status(400).send({ message: "banner id not valid" });
          }else{
            Banner.findByIdAndDelete(bannerId,(error,deletedData)=>{
                if(error){
                    res.status(400).send({
                        message:"banner data not found",
                        subError:error.message
                    })
                }else{
                    if(deletedData === null){
                        res.status(200).send({
                            message:"banner id not found",
                             bannerData:deletedData
                        })
                    }else{
                        res.status(200).send({
                            message:"banner deleted Data",
                            bannerData:deletedData
                        })
                    }
            
                }
            });
          }
    }catch(error){
        res.status(400).send({
            message:"Oops ! something went wrong in delete banner",
            error :error,
            subError:error.message
        })
    }
}


// CURD news letter api
exports.createNewsLetter = async(req,res)=>{
  
  
    try{
        let imagePath = "";
        if (req.file) {
          imagePath = req.file.path;
        }
        const newsLetter = new NewsLetter({
          title: req.body.title,
          backgroundImage: imagePath,
          description : req.body.description
        });
      
        await newsLetter.save().then((letterInfo) => {
            if(!letterInfo){
                res.status(400).send({
                    message:"news latter not created !",
                    data : letterInfo
                })
            }else{
                res.status(200).send({
                    message:"news latter created successfully !",
                    data : letterInfo
                });
            }
           
          })
          .catch((err) => {
            res.status(400).send({
                 message: "news latter not created !",
                 subError : err.message 
                });
          });
    }catch(error){
        res.status(400).send({
            message:"Oops ! something went wrong",
            subError : error.message
        })
    }

}
exports.updateNewsLetter = async(req,res)=>{
  try{
    const body = req.body;
    var updateData = {
        title:body.title,
        description:body.description,
       
    }
    
      if(req.file){
        updateData.backgroundImage = req.file.path
      }
  
      if (!ObjectId.isValid(body._id) && !ObjectId(body._id)) {
        res.status(400).send({ message: "banner id not valid" });
      }
      if(!body._id){
          res.status(400).send({
              message:"news letter id is required"
          })
      }
      
      else{
             NewsLetter.findByIdAndUpdate(body._id,updateData,{new:true},(error,updatedData)=>{
                if(error){
                    res.status(400).send({
                        message:"no data found in newslatter for this id",
                        subError:error.message
                    })
                }else{
                    res.status(200).send({
                        message:"data updated",
                        data:updatedData
                    })
                }
            })
      }


      if (Object.keys(body).length === 0 && body.constructor === Object) {
        res.status(400).send({ message: "body will not empty" });
      }
  }catch(error){
      res.status(400).send({
          message:"Oops ! something went wrong ",
          subError : error.message
      })
  }
  
}

exports.deleteNewsLetter = async(req,res)=>{
    try{
        const newsletterid = req.query.newsletterid;
     
        if (!ObjectId.isValid(newsletterid) && !ObjectId(newsletterid)) {
            res.status(400).send({ message: "news letter id not valid" });
          }
          
          if(!newsletterid){
            res.status(400).send({ message: "news letter id required" });
        }
          else{
            NewsLetter.findByIdAndDelete(newsletterid,(error,deletedData)=>{
                if(error){
                    res.status(400).send({
                        message:"news letter data not found",
                        subError:error.message
                    })
                }else{
                    if(!deletedData){
                        res.status(200).send({
                            message:"already deleted !"
                        });
                    }else{
                        res.status(200).send({
                            message:"news letter deleted Data",
                            deletedData:deletedData
                        });
                    }
                    
                }
            });
          }
    }catch(error){
        res.status(400).send({
            message:"Oops ! something went wrong in delete news latter",
            error :error,
            subError:error.message
        })
    }
}

exports.getNewsLetter = async(req,res)=>{
    try{
        const newsletterid = req.query.newsletterid;
      
        if (!ObjectId.isValid(newsletterid) && !ObjectId(newsletterid)) {
            res.status(400).send({ message: "news letter id not valid" });
          }
          if(!newsletterid){
            NewsLetter.find().then(NewsLetterData=>{
                if(NewsLetterData.length === 0){
                    res.status(400).send({
                        message:"no records found ",
                        NewsLetterData:NewsLetterData
                    })
                }else{
                    res.status(200).send({
                        message:"news letter data ",
                        NewsLetterData:NewsLetterData
                    })
                }
             
            }).catch(error=>{
                res.status(400).send({
                    message:"news letter data not found",
                    subError:error
                })
            });
          }
        else{
            NewsLetter.findById(newsletterid,(error,NewsLetterData)=>{
                if(error){
                    res.status(400).send({
                        message:"news letter data not found",
                        subError:error.message
                    })
                }else{
                    if(!NewsLetterData){
                        res.status(200).send({
                            message:"No records found for this id",
                            NewsLetterData:NewsLetterData
                        })
                    }else{
                        res.status(200).send({
                            message:"news letter  Data",
                            NewsLetterData:NewsLetterData
                        });
                    }
               
                }
            });

   
          }
    }catch(error){
        res.status(400).send({
            message:"Oops ! something went wrong in get news letter",
            error :error,
            subError:error.message
        })
    }
}