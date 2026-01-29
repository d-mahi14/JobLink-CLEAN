// Simple logger utility for better debugging

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const getTimestamp = () => {
  return new Date().toISOString();
};

export const logger = {
  info: (message, data = null) => {
    console.log(
      `${colors.cyan}[INFO]${colors.reset} ${colors.bright}${getTimestamp()}${colors.reset} - ${message}`,
      data ? '\n' + JSON.stringify(data, null, 2) : ''
    );
  },

  success: (message, data = null) => {
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} ${colors.bright}${getTimestamp()}${colors.reset} - ${message}`,
      data ? '\n' + JSON.stringify(data, null, 2) : ''
    );
  },

  error: (message, error = null) => {
    console.error(
      `${colors.red}[ERROR]${colors.reset} ${colors.bright}${getTimestamp()}${colors.reset} - ${message}`,
      error ? '\n' + (error.stack || JSON.stringify(error, null, 2)) : ''
    );
  },

  warn: (message, data = null) => {
    console.warn(
      `${colors.yellow}[WARN]${colors.reset} ${colors.bright}${getTimestamp()}${colors.reset} - ${message}`,
      data ? '\n' + JSON.stringify(data, null, 2) : ''
    );
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${colors.magenta}[DEBUG]${colors.reset} ${colors.bright}${getTimestamp()}${colors.reset} - ${message}`,
        data ? '\n' + JSON.stringify(data, null, 2) : ''
      );
    }
  },

  request: (req) => {
    console.log(
      `${colors.blue}[REQUEST]${colors.reset} ${colors.bright}${getTimestamp()}${colors.reset} - ${req.method} ${req.path}`,
      req.body && Object.keys(req.body).length > 0 
        ? `\nBody: ${JSON.stringify(req.body, null, 2)}`
        : ''
    );
  }
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  logger.request(req);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? colors.red : colors.green;
    
    console.log(
      `${statusColor}[RESPONSE]${colors.reset} ${colors.bright}${getTimestamp()}${colors.reset} - ${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};

export default logger;