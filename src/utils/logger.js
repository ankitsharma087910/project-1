import winston from 'winston'

 

 const logger = winston.createLogger({
   level: "info",
   format: winston.format.combine(
     winston.format.timestamp(),
     winston.format.json()
   ),
   transports: [
     // Logs errors (level 'error') to 'error.log'

     new winston.transports.File({ filename: "error.log", level: "error" }),

     // Logs all levels from 'info' and above to 'combined.log'
     new winston.transports.File({ filename: "combined.log" }),

     new winston.transports.Console({
        format:winston.format.simple()
     })
   ],
 });

 export default logger;