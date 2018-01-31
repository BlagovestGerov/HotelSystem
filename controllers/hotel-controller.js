const Hotel = require('mongoose').model('Hotel');
const Category = require('mongoose').model('Category')

module.exports = {
    addHotel:(req, res)=>{
        let bodyParams = req.body;

        let hotelObj = {
            title:bodyParams.title,
            location:bodyParams.location,
            image:bodyParams.image,
            category:bodyParams.type,
            description:bodyParams.textArea,
            dateCreation:Date.now()
        }

        Hotel.create(hotelObj)
        .then((h)=>{
            Category.findOne({catName:req.body.type}).then(foundCat=>{
                foundCat.hotels.push(h._id)
                foundCat.save().then(()=>{
                    res.render('hotels/generateHotel',{successMessage: 'All is ok'})                    
                })
            })
        }).catch(e=>{
            res.locals.globalError = e.message
            res.render('hotels/generateHotel')
        })
    },
    getAddHotelView:(req, res)=>{
        Category.find({}).then(cats=>{

            res.render('hotels/generateHotel', {cats})
        })
    },
    getDetails:(req,res)=>{
        let targetHotel = req.query.id


        Hotel.findById(targetHotel).populate('comments.creator').then(selectedHotel=>{
            selectedHotel.prop = selectedHotel.like.length
            selectedHotel.viewCounter+=1
            selectedHotel.save(selectedHotel).then(()=>{            

            let comments = []
            for(let elem of selectedHotel.comments){
                let tempObj = {
                    creator: elem.creator._id,
                    userName: elem.creator.username,
                    userComment: elem.description,
                    userTitle:elem.title,
                    datePosted:elem.creationDate.toUTCString()
                }
                comments.push(tempObj)
            }

                res.render('hotels/details',{selectedHotel,comments})                
            })
            
        })
    },
    likeDislike:(req,res)=>{
        let hotelId = req.params.id

        Hotel.findById(hotelId).then((selectedHotel)=>{
            let userId = req.user._id

            let indexOfElem = selectedHotel.like.indexOf(userId)
            if(indexOfElem>=0){
                selectedHotel.like.splice(indexOfElem,1)
            }else{
                selectedHotel.like.push(userId)
            }
            selectedHotel.save().then((e)=>{
                if(e){
                    console.log(e)
                }
                res.redirect('back')
            })
        })
    },
    getList:(req,res)=>{

        let page = Number(req.query.page)||1
        let limit = 2
        
        Hotel.count({}).then(hotelCount=>{

            let maxPages = Math.ceil(hotelCount/limit)

            if(page > maxPages){
                page = maxPages
            }
            if(page<0){
                page=1
            }

            let pages = {
                nextPage: page+1>maxPages?maxPages:page+1,
                prevPage: page-1 < 1 ? 1 : page-1
            }

            Hotel.find({}).skip((page-1)*limit).limit(limit).then(hotels=>{
                res.render('hotels/hotelList',{hotels, pages})
            })
        })
    }
    
}

