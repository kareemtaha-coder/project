import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCourses from '../components/home/FeaturedCourses';
import Statistics from '../components/home/Statistics';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedCourses />
      <Statistics />
    </div>
  );
};

export default HomePage;