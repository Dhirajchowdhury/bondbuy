
import React from 'react';
import Hero from './Hero';
import InfoStrip from './InfoStrip';

interface LandingPageProps {
  onConnect: () => void;
  isConnected: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect, isConnected }) => {
  return (
    <>
      <Hero onConnect={onConnect} isConnected={isConnected} />
      <InfoStrip />
    </>
  );
};

export default LandingPage;
