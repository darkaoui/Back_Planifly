import asyncHandler from 'express-async-handler'
import Flight from '../models/flightModel.js'
import User from '../models/userModel.js'
import FlightPassenger from '../models/flightPassengerModel.js'

const getFlights = asyncHandler(async (req,res)=>{
    const flights = await Flight.find({})
    res.json(flights)
})

const getFlightById = asyncHandler(async (req,res)=>{
    const flight = await Flight.findOne({idFlight:req.params.id})
    if (flight) {
        const pilote = await User.findOne({_id:flight.pilote})
        if (pilote) {
            const newFlight = {
                idFlight: flight.idFlight, 
                plane: flight.plane, 
                pilote: pilote, 
                aerodrome: flight.aerodrome, 
                seats: flight.seats, 
                seatsAvailable: flight.seatsAvailable, 
                date: flight.date, 
                duration: flight.duration, 
                price: flight.price, 
                disableSeats: flight.disableSeats
            }
            res.json(newFlight)
        } else {
            res.status(404)
            console.log('Pilote non existant')
            throw new Error('Pilote non existant')
        }
    } else {
        res.status(404)
        console.log('Flight non existant')
        throw new Error('Flight non existant')
    }
})


const getFlightsByPilote = asyncHandler(async (req,res)=>{
    const flights = await Flight.find({pilote:req.params.pilote})
    if (flights) {
        res.json(flights)
    } else {
        res.status(404)
        console.log('Flight non existant')
        throw new Error('Flights non existant')
    }
})

const getFlightsByFilters = asyncHandler(async (req,res)=>{
    const params = JSON.parse(req.params.filter)
    const flights = await Flight.find({aerodrome:{$regex:params.aerodrome}, plane:{$regex:params.plane}, date:{$regex:params.date}})
    if (flights) {
        res.json(flights)
    } else {
        res.status(404)
        console.log('Flight non existant')
        throw new Error('Flights non existant')
    }
})

const addFlight = asyncHandler(async (req,res)=>{
    try {
        const {idFlight, plane, pilote, aerodrome, seats, seatsAvailable, date, duration, price, disableSeats} = JSON.parse(req.params.flight)
        const flightExist = await Flight.findOne({idFlight:idFlight})
        
        if(flightExist) {
            console.log("Flight already exist")
            return res.status(400).json({
                message:`Flight already exist`
            })
        } else {
            const flight = await Flight.create({
                idFlight: idFlight, 
                plane: plane, 
                pilote: pilote, 
                aerodrome: aerodrome, 
                seats: seats, 
                seatsAvailable: seatsAvailable, 
                date: date, 
                duration: duration, 
                price: price, 
                disableSeats: disableSeats
            })

            if(flight) {
                return res.status(200).json({
                    message:`Success`,
                    data:flight
                })
            } else {
                console.log(`Invalid flight data ${req.params.flight}`)
                return res.status(400).json({
                    message:`Invalid flight data`
                })
            }
        }
    } catch (error) {
        console.error()
        console.log(error.message)
        return res.status(500).json({
            message:`Error during flight creation`,
            data:error
        })
    }
})

const addPassenger = asyncHandler(async (req,res)=>{
    const {idFlight, idPassenger, seatQuantity, disableSeatQuantity} = JSON.parse(req.params.passenger)
    const flight = await Flight.findOne({idFlight:idFlight})
        
    if(!flight) {
        return res.status(400).json({
            message:`Flight doesn't exist`
        })
    } else {
        if (seatQuantity > flight.seatsAvailable || disableSeatQuantity > flight.disableSeats) {
            console.log("Too many seats")
            return res.status(400).json({
                message:`Too many seats`
            })
        } else {
            const passengerExist = await FlightPassenger.findOne({idFlight:idFlight,idPassenger:idPassenger})
            if (passengerExist) {
                passengerExist.seatQuantity += seatQuantity
                passengerExist.disableSeatQuantity += disableSeatQuantity
                const flightPassenger = await FlightPassenger.findOneAndUpdate({_id:passengerExist._id}, passengerExist, {new:false})
                if(flightPassenger) {
                    flight.seatsAvailable -= seatQuantity
                    flight.disableSeats -= disableSeatQuantity
                    const flightUpdated = await Flight.findOneAndUpdate({idFlight:idFlight},{$set: {
                        seatsAvailable: flight.seatsAvailable, disableSeats: flight.disableSeats
                    }},{new:false})
                    if(flightUpdated) {
                        return res.status(201).json({
                            message:`Success`,
                            data: flightPassenger
                        })
                    } else {
                        console.log(`Fail to update flight information : ${flight}`)
                        return res.status(400).json({
                            message:`Fail to update flight information`
                        })
                    }
                } else {
                    console.log(`Fail to update passenger information`)
                    return res.status(400).json({
                        message:`Fail to update passenger information : ${passengerExist}`
                    })
                }
                
            } else {
                const flightPassenger = await FlightPassenger.create({
                    idFlight: idFlight,
                    idPassenger:idPassenger,
                    seatQuantity: seatQuantity,
                    disableSeatQuantity: disableSeatQuantity
                })
    
                if(flightPassenger) {
                    flight.seatsAvailable -= seatQuantity
                    flight.disableSeats -= disableSeatQuantity
                    const flightUpdated = await Flight.findOneAndUpdate({idFlight:idFlight},{$set: {
                        seatsAvailable: flight.seatsAvailable, disableSeats: flight.disableSeats
                    }},{new:false})
                    if(flightUpdated) {
                        return res.status(201).json({
                            message:`Success`,
                            data: flightPassenger
                        })
                    } else {
                        console.log(`Fail to update flight information : ${flight}`)
                        return res.status(400).json({
                            message:`Fail to update flight information`
                        })
                    }
                } else {
                    console.log(`Invalid flight passenger data : ${idFlight} ${idPassenger} ${seatQuantity} ${disableSeatQuantity}`)
                    return res.status(400).json({
                        message:`Invalid flight passenger data`
                    })
                }
            }
        }
    }
})

const deleteFlight = asyncHandler(async (req,res)=>{
    const result = await Flight.deleteOne({idFlight:req.params.flight})
    if(result)
        return res.status(201).json({
            message:`Success`
        })
    else
        return res.status(400).json({
            message:"Fail to delete flight"
        })
})

const deletePassenger = asyncHandler(async (req,res)=>{
    const result = await FlightPassenger.deleteOne({idFlight:{$regex:req.params.flight}, idPassenger:{$regex:req.params.passenger}})
    console.log(result)
    if(result)
        return res.status(201).json({
            message:`Success`
        })
    else
        return res.status(400).json({
            message:"Fail to delete book"
        })
})

export {
    getFlights,
    getFlightById,
    getFlightsByPilote,
    getFlightsByFilters,
    addFlight,
    addPassenger,
    deleteFlight,
    deletePassenger
}