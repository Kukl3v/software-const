import React from 'react';

function ContentBlock({ valueBlock }) {
  return (
    <div className="container mx-auto sm:px-4 my-5 p-6">
      {valueBlock}
    </div>
  );
}

export default ContentBlock