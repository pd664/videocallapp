import React from 'react';
import { MeetingProvider } from 'amazon-chime-sdk-component-library-react';
import MeetingForm from './MeetingForm';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"
import { BrowserRouter as Router, Route} from 'react-router-dom';
import MeetingScreen from './MeetingScreen';

const MeetingProviderWrapper = () => {  
  const getMeetingProviderWrapper = () => {
    return (
      <div>
         <Router>
         <Route exact path="/" component={MeetingForm} />
         <Route exact path="/meetings" component={MeetingScreen} />
         </Router>
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