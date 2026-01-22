import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadge = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 bg-muted/30 rounded-md p-2">
      <div className="w-9 h-9 bg-white/30 rounded-md flex items-center justify-center flex-shrink-0">
        <Icon name={icon} size={18} />
      </div>
      <div className="text-sm text-foreground truncate">{text}</div>
    </div>
  );
};

export default SecurityBadge;
