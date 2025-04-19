/**
 * Determines the user role based on the current URL path
 * @returns {'student'|'tutor'|'admin'} The detected role
 */
export const getRoleFromURL = () => {
  const path = window.location.pathname;

  // Check for role in the URL path - take the first match
  if (path.startsWith('/admin')) {
    return 'admin';
  } else if (path.startsWith('/tutor')) {
    return 'tutor';
  } else if (path.startsWith('/student')) {
    return 'student';
  }

  // Default to student if no role is found in URL
  return 'student';
};
