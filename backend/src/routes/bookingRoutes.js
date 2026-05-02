import express from 'express';
import { createBooking, getBookingById, getUserBookings, updateBookingStatus, getAllBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getAllBookings);
router.post('/', createBooking);
// IMPORTANT: specific named routes must come BEFORE parameterized /:id routes
router.get('/user/:userId', getUserBookings);
router.patch('/:id/status', updateBookingStatus);
router.get('/:id', getBookingById);

export default router;
