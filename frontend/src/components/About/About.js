import React from 'react';
import './About.css'; // CSS for styling

const About = () => {
  const teamMembers = [
    {
      name: 'Alice Johnson',
      role: 'Frontend Developer',
      image: '/images/dv.jpg', // Replace with your image paths
      description: 'Expert in React and CSS, passionate about building beautiful interfaces.'
    },
    {
      name: 'Bob Smith',
      role: 'Backend Developer',
      image: '/images/dvv.jpg', // Replace with your image paths
      description: 'Specializes in Node.js and Django, ensuring smooth server-side operations.'
    },
    {
      name: 'Charlie Brown',
      role: 'UI/UX Designer',
      image: '/images/dvvv.jpg', // Replace with your image paths
      description: 'Creative designer focused on enhancing user experience through innovative design.'
    },
  ];

  return (
    <div className="about-section">
      <h2 className="about-title">About Our Team</h2>
      <p className="about-description">
        We are a dedicated team of professionals committed to delivering innovative solutions 
        that enhance user experiences and drive results. With diverse skills in development 
        and design, we work collaboratively to turn ideas into reality and provide top-notch 
        services for our clients.
      </p>
      <div className="card-container">
        {teamMembers.map((member, index) => (
          <div className="card" key={index}>
            <div className="card-image">
              <img src={member.image} alt={member.name} />
            </div>
            <div className="card-content">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-description">{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
