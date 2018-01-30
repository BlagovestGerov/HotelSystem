const Hotel = require('mongoose').model('Hotel');

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

        Hotel.create(hotelObj).then((h)=>{
            res.render('hotels/generateHotel',{successMessage: 'All is ok'})
        }).catch(e=>{
            res.locals.globalError = e.message
            res.render('hotels/generateHotel')
        })
    },
    getAddHotelView:(req, res)=>{
    res.render('hotels/generateHotel')
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
                    userName:elem.creator.username,
                    userComment:elem.description,
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
    }
    
}

