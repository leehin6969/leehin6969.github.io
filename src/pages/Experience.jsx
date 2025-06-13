import styled from '@emotion/styled';
import { memo, useMemo } from 'react';

const Section = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  min-height: 100%;
  padding: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  text-align: right;

  @media (max-width: 768px) {
    display: none; /* Hide title on mobile */
  }
`;

const Timeline = styled.div`
  max-height: 60vh;
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
    max-height: 65vh; /* Increase height since no title */
    padding-right: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: 480px) {
    max-height: 70vh; /* Even more height on mobile */
    padding-right: 0;
  }
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#333' : '#e1e5e9'};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: block; /* Change to block layout on mobile */
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }
`;

const Date = styled.div`
  font-size: 0.9rem;
  color: #3b82f6;
  font-weight: 500;
  padding-top: 1.2rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding-top: 0;
    /* Will be positioned by specific mobile layout */
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding-top: 0;
  }
`;

const TimelineContent = styled.div`
  /* Desktop: normal content flow */
  
  @media (max-width: 768px) {
    /* Mobile: will be restructured */
  }
`;

const JobTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Company = styled.p`
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const AwardHighlight = styled.div`
  color: #f59e0b;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0.5rem 0;
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)'};
  border-radius: 4px;
  border-left: 3px solid #f59e0b;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
    margin: 0.5rem 0;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.15rem 0.3rem;
  }
`;

const Description = styled.p`
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  line-height: 1.6;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    line-height: 1.4;
  }
`;

// Mobile-only wrapper to control order
const MobileContent = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// Desktop-only wrapper
const DesktopContent = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Experience = memo(function Experience() {
  // Memoize experience data to prevent recreating objects
  const experienceData = useMemo(() => [
    {
      id: 1,
      date: "Oct 2023 – Feb 2025",
      title: "System Administrator",
      company: "Texwinca Holdings Limited, Hong Kong",
      description: "Designed automated workflows reducing IT tickets by 30% and sales team tasks by 25%. Managed SQL servers, developed BI reports, and provided technical support for 100+ retail locations across Hong Kong, China, and Singapore."
    },
    {
      id: 2,
      date: "July 2024 – Aug 2024",
      title: "Front-End Developer",
      award: "Website nominated for 2024 KAN TAI-KEUNG DESIGN AWARD",
      company: "Zuni Icosahedron, Hong Kong",
      description: "Collaborated with UI/UX designers to build 10+ multilingual WordPress sites with interactive features, boosting engagement by 25%.",
    },
    {
      id: 3,
      date: "June 2021 – Sep 2023",
      title: "IT Support",
      company: "Hung Ling Restaurant, Hong Kong",
      description: "Provided comprehensive IT assistance and designed complete network infrastructure including POS systems and printers to ensure smooth daily operations."
    }
  ], []);

  return (
    <Section>
      <Content>
        <Title><br /></Title>
        <Timeline>
          {experienceData.map((item) => (
            <TimelineItem key={item.id}>
              {/* Desktop Layout: Date in left column, content in right column */}
              <DesktopContent>
                <Date>{item.date}</Date>
              </DesktopContent>

              <DesktopContent>
                <TimelineContent>
                  <JobTitle>{item.title}</JobTitle>
                  <Company>{item.company}</Company>
                  {item.award && (
                    <AwardHighlight>
                      {item.award}
                    </AwardHighlight>
                  )}
                  <Description>{item.description}</Description>
                </TimelineContent>
              </DesktopContent>

              {/* Mobile Layout: All content in specific order */}
              <MobileContent>
                <JobTitle>{item.title}</JobTitle>
                <Date>{item.date}</Date>
                <Company>{item.company}</Company>
                {item.award && (
                  <AwardHighlight>
                    🏆 {item.award}
                  </AwardHighlight>
                )}
                <Description>{item.description}</Description>
              </MobileContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Content>
    </Section>
  );
});

export default Experience; 