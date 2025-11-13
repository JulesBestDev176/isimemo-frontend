import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 text-white rounded-md flex items-center justify-center shadow-md">
        <span className="material-icons">school</span>
      </div>
      <span className="text-lg font-bold text-gray-800">
        ISI<span className="text-primary">Memo</span>
      </span>
    </div>
  );
};

export default Logo;


