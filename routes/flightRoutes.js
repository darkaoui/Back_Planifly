import express from 'express'
const router = express.Router()
import { getFlights, getFlightById, getFlightsByFilters, addFlight, addPassenger } from '../controllers/flightController.js'

router.route('/').get(getFlights)
router.route('/:id').get(getFlightById)
router.route('/filter/:filter').get(getFlightsByFilters)
router.route('/add/flight/:flight').put(addFlight)
router.route('/add/passenger/:passenger').put(addPassenger)

export default router