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

        Hotel.findById(targetHotel).then(selectedHotel=>{

            selectedHotel.viewCounter+=1
            selectedHotel.save(selectedHotel).then(()=>{
                res.render('hotels/details',{selectedHotel})                
            })
            
        })
    }
}

