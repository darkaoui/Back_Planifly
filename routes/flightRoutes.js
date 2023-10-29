import express from 'express'
const router = express.Router()
import { getFlights, getFlightById, getFlightsByPilote, getFlightsByFilters, addFlight, addPassenger, deletePassenger, deleteFlight } from '../controllers/flightController.js'

router.route('/').get(getFlights)
router.route('/:id').get(getFlightById)
router.route('/pilote/:pilote').get(getFlightsByPilote)
router.route('/filter/:filter').get(getFlightsByFilters)
router.route('/add/flight/:flight').put(addFlight)
router.route('/add/passenger/:passenger').put(addPassenger)
router.route('/delete/passenger/:flight/:passenger').delete(deletePassenger)
router.route('/delete/:flight').delete(deleteFlight)

export default router