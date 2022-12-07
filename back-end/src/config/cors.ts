/**
 * Cors origin checkup.
 * Function contains two parameters, origin and callback.
 * Origin : Does not have acces to request, only the origin as string.
 * Callback : Validate the cors, could be callback(true/null/false).
 * 
 * OR
 * 
 * Cors delegation.
 * Function contains two paramaeters, request and callback.
 * ! You will need to setup the origin parameters by yourself.
 * Request : Express request
 * Callback : Validate the cors, could be callback(true/null/false) or callback(origins options).
 * 
 * ! This file will use config.whitelist to validate the origin.
 */