import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

const Section = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 100%;
  padding: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
    padding: 1.5rem 1rem;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

const Content = styled.div`
  max-width: 47rem;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#333' : '#e1e5e9'};
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    max-height: 60vh;
    padding-right: 0.5rem;
    gap: 0.75rem;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: 480px) {
    max-height: 55vh;
    gap: 0.5rem;
    padding-right: 0;
  }
`;

const ProjectRow = styled(motion.div)`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e1e5e9'};
  border-radius: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #5c2c23 0%, #a4453f 50%, #d86d73 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    gap: 0.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.5rem;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 2rem;
  font-weight: 500;
  margin: 0;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};

  @media (max-width: 768px) {
    gap: 0.75rem;
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.7rem;
  }
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  line-height: 1.5;
  font-size: 0.9rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

// Memoized animation variants
const rowVariants = {
  tap: { scale: 0.98 }
};

const Projects = memo(function Projects() {
  // Memoize project data to prevent recreating objects
  const projectData = useMemo(() => [
    {
      id: 1,
      title: "HKJC Calligraphy Metaverse Website",
      date: "Aug. 2024",
      type: "Dev / Design: Carol Mak",
      link: "https://jc-ccultureatt.zuni.org.hk/en/calligraphy/opening-3/"
    },
    {
      id: 2,
      title: "MEBOARD",
      date: "Oct. 2023",
      type: "Dev & Design",
      link: "https://social-app-drab.vercel.app/"
    }
  ], []);

  const handleProjectClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Section>
      <Content>
        <ProjectsList>
          {projectData.map((project) => (
            <ProjectRow
              key={project.id}
              variants={rowVariants}
              whileTap="tap"
              onClick={() => handleProjectClick(project.link)}
            >
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectMeta>
                <span>{project.date}</span>
                <span>{project.type}</span>
              </ProjectMeta>
              <ProjectDescription>
                {project.description}
              </ProjectDescription>
            </ProjectRow>
          ))}
        </ProjectsList>
      </Content>
    </Section>
  );
});

export default Projects; 