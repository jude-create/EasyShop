export function getProductBadgeColors(badge?: string) {
  const value = (badge || '').trim().toLowerCase();

  if (value === 'hot') {
    return {
      backgroundColor: '#EF4444',
      textColor: '#FFFFFF',
    };
  }

  if (value === 'new') {
    return {
      backgroundColor: '#2563EB',
      textColor: '#FFFFFF',
    };
  }

  if (value === 'discount') {
    return {
      backgroundColor: '#16A34A',
      textColor: '#FFFFFF',
    };
  }

  return {
    backgroundColor: '#6B7280',
    textColor: '#FFFFFF',
  };
}
