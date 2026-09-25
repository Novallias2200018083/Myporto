'use client';

import React from 'react';
import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, size = 20, className = '' }) {
  // Fallback if icon doesn't exist
  const IconComponent = Icons[name] || Icons.Code;
  return <IconComponent size={size} className={className} />;
}
