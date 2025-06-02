
export class SecurityUtils {
  // HTML sanitization without external dependencies
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove basic HTML chars
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .trim();
  }

  // Input validation
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

    return sanitized;
  }

  // File name validation
  static validateFileName(fileName: string): boolean {
    if (!fileName || typeof fileName !== 'string') return false;
    
    // Check for suspicious characters
    const suspiciousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (suspiciousChars.test(fileName)) return false;
    
    // Check for suspicious extensions
    const suspiciousExtensions = /\.(exe|bat|cmd|scr|vbs|js|jar|com|pif)$/i;
    if (suspiciousExtensions.test(fileName)) return false;
    
    return true;
  }

  // Generic error response (hide internal details)
  static createSafeErrorResponse(error: unknown): string {
    if (error instanceof Error) {
      // Only return specific error messages we know are safe
      const safeErrors = [
        'Query cannot be empty',
        'Query too long',
        'Rate limit exceeded',
        'Service temporarily unavailable',
        'Invalid file format',
        'File too large'
      ];
      
      if (safeErrors.some(safe => error.message.includes(safe))) {
        return error.message;
      }
    }
    
    return 'An error occurred. Please try again later.';
  }
}
