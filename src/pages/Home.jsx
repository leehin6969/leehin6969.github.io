import styled from '@emotion/styled';
import { memo } from 'react';

const Section = styled.section`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100%;
  padding: 2rem;
  pointer-events: none;

  @media (max-width: 768px) {
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Content = styled.div`
  max-width: 400px;
  width: auto;
  text-align: right;
  pointer-events: none;

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
  }
`;

const Bio = styled.div`
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.6;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#FFFFFF'};
  letter-spacing: 0.01em;
  pointer-events: auto;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    line-height: 1.5;
    max-width: 300px;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.4;
    max-width: 250px;
  }
`;

const Home = memo(function Home() {
  return (
    <Section>
      <Content>
        <Bio>
          Born in 2003<br />
          in Hong Kong,<br />
          I'm a front-end web<br />
          developer & support<br />
          specialist. My favor <br />album is<br />
          Because the internet<br />
          and that's the reason <br />why you are here.<br />
        </Bio>
      </Content>
    </Section>
  );
});

export default Home; 