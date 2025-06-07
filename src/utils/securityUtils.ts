
export class SecurityUtils {
  // Enhanced HTML sanitization
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove basic HTML chars
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/style\s*=/gi, '') // Remove style attributes
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/expression\s*\(/gi, '') // Remove CSS expressions
      .trim();
  }

  // Enhanced input validation with XSS protection
  static validateInput(input: string, maxLength: number = 500): string {
    if (!input || typeof input !== 'string') {
      throw new Error('Invalid input');
    }

    const sanitized = this.sanitizeHtml(input);
    
    if (sanitized.length === 0) {
      throw new Error('Input cannot be empty after sanitization');
    }

    if (sanitized.length > maxLength) {
      throw new Error(`Input too long (max ${maxLength} characters)`);
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\b(eval|function|constructor)\s*\(/i,
      /\b(alert|confirm|prompt)\s*\(/i,
      /(src|href)\s*=\s*["']?\s*javascript:/i,
      /\bon\w+\s*=/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitized)) {
        throw new Error('Input contains potentially malicious content');
      }
    }

    return sanitized;
  }

  // Enhanced file name validation
  static validateFileName(fileName: string): boolean {
    if (!fileName || typeof fileName !== 'string') return false;
    
    // Check length
    if (fileName.length > 255) return false;
    
    // Check for suspicious characters
    const suspiciousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (suspiciousChars.test(fileName)) return false;
    
    // Check for suspicious extensions
    const suspiciousExtensions = /\.(exe|bat|cmd|scr|vbs|js|jar|com|pif|app|dmg|pkg|deb|rpm)$/i;
    if (suspiciousExtensions.test(fileName)) return false;
    
    // Check for reserved names (Windows)
    const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;
    if (reservedNames.test(fileName)) return false;
    
    return true;
  }

  // Validate file type based on MIME type and extension
  static validateFileType(fileName: string, mimeType: string, allowedTypes: string[]): boolean {
    const extension = fileName.toLowerCase().split('.').pop();
    
    // Check if extension is in allowed list
    const allowedExtensions = allowedTypes.map(type => {
      const parts = type.split('/');
      return parts[1] || parts[0];
    });
    
    if (!extension || !allowedExtensions.includes(extension)) {
      return false;
    }

    // Check MIME type
    if (!allowedTypes.some(type => mimeType.startsWith(type))) {
      return false;
    }

    return true;
  }

  // Rate limiting check (simple implementation)
  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing requests from localStorage (client-side rate limiting)
    const requestsKey = `rate_limit_${key}`;
    const existingRequests = JSON.parse(localStorage.getItem(requestsKey) || '[]');
    
    // Filter requests within the time window
    const recentRequests = existingRequests.filter((timestamp: number) => timestamp > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Add current request
    recentRequests.push(now);
    localStorage.setItem(requestsKey, JSON.stringify(recentRequests));
    
    return true;
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate CSRF token
  static validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }

  // Enhanced error response with security considerations
  static createSafeErrorResponse(error: unknown): string {
    if (error instanceof Error) {
      // Only return specific error messages we know are safe
      const safeErrors = [
        'Query cannot be empty',
        'Query too long',
        'Rate limit exceeded',
        'Service temporarily unavailable',
        'Invalid file format',
        'File too large',
        'Authentication required',
        'Access denied',
        'Invalid input',
        'Input contains potentially malicious content'
      ];
      
      if (safeErrors.some(safe => error.message.includes(safe))) {
        return error.message;
      }
    }
    
    return 'An error occurred. Please try again later.';
  }

  // Password strength validation
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain lowercase letters');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain uppercase letters');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('Password must contain numbers');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password must contain special characters');
    } else {
      score += 1;
    }

    // Check for common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      feedback.push('Password contains common patterns');
      score -= 1;
    }

    return {
      isValid: feedback.length === 0 && score >= 4,
      score: Math.max(0, score),
      feedback
    };
  }

  // Secure session management
  static setSecureSessionData(key: string, value: any, expirationMinutes: number = 30): void {
    const expirationTime = Date.now() + (expirationMinutes * 60 * 1000);
    const sessionData = {
      value,
      expiration: expirationTime
    };
    
    sessionStorage.setItem(key, JSON.stringify(sessionData));
  }

  static getSecureSessionData(key: string): any {
    const storedData = sessionStorage.getItem(key);
    if (!storedData) return null;

    try {
      const sessionData = JSON.parse(storedData);
      if (Date.now() > sessionData.expiration) {
        sessionStorage.removeItem(key);
        return null;
      }
      return sessionData.value;
    } catch {
      sessionStorage.removeItem(key);
      return null;
    }
  }
}
