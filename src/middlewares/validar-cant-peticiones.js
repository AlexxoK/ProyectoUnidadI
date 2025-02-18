import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutacos
    max: 100,
    message: {
        success: false,
        msg: "Too many requests, try later!"
    }
});

export default limiter;