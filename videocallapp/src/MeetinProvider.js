import React from 'react';
import { MeetingProvider } from 'amazon-chime-sdk-component-library-react';
import MeetingForm from './MeetingForm';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"

const MeetingProviderWrapper = () => {  
  const getMeetingProviderWrapper = () => {
    return (
      <div>
            <MeetingForm />   
      </div>
    );
  };

  const getMeetingProvider = (children) => {
    return (
      <MeetingProvider >
        {children}
      </MeetingProvider>
    );
  };
  
  const getMeetingProviderWithFeatures = () => {
    let children = getMeetingProviderWrapper();
    children = getMeetingProvider(children);
    return children;
  };
  
  return (
    <div>
      {getMeetingProviderWithFeatures()}
    </div>
  );
};

export default MeetingProviderWrapper;