import React, { useState } from 'react';
import ButtonGroup from './ButtonGroup';
import Comp1 from './components/comp1';
import Comp2 from './components/AllUsers';
import Comp3 from './components/comp3';
import Comp4 from './components/comp4';
import Comp5 from './components/comp5';
import Comp6 from './components/comp6';

const buttons = [
  "Job Posts", "All users", "Report", "Subscription", "Verify Uses", "Change Password"
];

const Dashboard = () => {
  const [isSelected, setIsSelected] = useState(0);

  const RenderComponent = ({ index }) => {
    switch (index) {
      case 0: return <Comp1 />;
      case 1: return <Comp2 />;
      case 2: return <Comp3 />;
      case 3: return <Comp4 />;
      case 4: return <Comp5 />;
      case 5: return <Comp6 />;
      default: return null;
    }
  };

  return (
    <div className='bg-[#f6f8f9] h-screen flex overflow-hidden'>
      <div className='h-full sticky top-0 bg-white m-0 p-0 rounded-3xl w-64'>
        <ButtonGroup buttons={buttons} isSelected={isSelected} setIsSelected={setIsSelected} />
      </div>
      <div className='h-full w-full overflow-y-auto m-0 p-0'>
        <RenderComponent index={isSelected} />
      </div>
    </div>
  );
};

export default Dashboard;
