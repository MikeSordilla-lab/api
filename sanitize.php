<?php

declare(strict_types=1);

/**
 * Sanitizes user input to prevent XSS attacks
 * Applies HTML entity encoding and trimming
 * 
 * @param mixed $input The input to sanitize (string or array)
 * @return mixed The sanitized input
 */
function sanitize_input($input)
{
  if (is_array($input)) {
    return array_map('sanitize_input', $input);
  }

  if (!is_string($input)) {
    return $input;
  }

  // Trim whitespace and apply HTML entity encoding
  return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
