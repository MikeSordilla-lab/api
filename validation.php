<?php

declare(strict_types=1);

/**
 * Validates student data before insert/update operations
 * 
 * @param array $data The student data to validate
 * @return array Array of validation errors (empty if valid)
 */
function validate_student_data(array $data): array
{
  $errors = [];

  // Firstname validation
  $firstname = trim($data['firstname'] ?? '');

  if (empty($firstname)) {
    $errors[] = 'Firstname is required';
  } elseif (strlen($firstname) < 2) {
    $errors[] = 'Firstname must be at least 2 characters';
  } elseif (strlen($firstname) > 100) {
    $errors[] = 'Firstname must not exceed 100 characters';
  } elseif (!preg_match('/^[a-zA-Z\s\'-]+$/', $firstname)) {
    $errors[] = 'Firstname contains invalid characters. Only letters, spaces, apostrophes, and hyphens allowed';
  }

  // Lastname validation
  $lastname = trim($data['lastname'] ?? '');

  if (empty($lastname)) {
    $errors[] = 'Lastname is required';
  } elseif (strlen($lastname) < 2) {
    $errors[] = 'Lastname must be at least 2 characters';
  } elseif (strlen($lastname) > 100) {
    $errors[] = 'Lastname must not exceed 100 characters';
  } elseif (!preg_match('/^[a-zA-Z\s\'-]+$/', $lastname)) {
    $errors[] = 'Lastname contains invalid characters. Only letters, spaces, apostrophes, and hyphens allowed';
  }

  // Ratings validation
  $ratings = $data['ratings'] ?? '';

  if ($ratings === '' || $ratings === null) {
    $errors[] = 'Ratings is required';
  } else {
    $ratings_float = floatval($ratings);

    if ($ratings_float < 0) {
      $errors[] = 'Ratings must be at least 0';
    } elseif ($ratings_float > 100) {
      $errors[] = 'Ratings must not exceed 100';
    }
  }

  return $errors;
}
