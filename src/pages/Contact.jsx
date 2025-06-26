import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

const Section = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  min-height: 100%;
  padding: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
    align-items: center;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: right;

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Text = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const ContactRow = styled.div`
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;

  @media (max-width: 768px) {
    text-align: center;
    padding: 0.4rem 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.3rem 0.25rem;
  }
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ContactLink = styled.a`
  color: inherit;
  text-decoration: none;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Contact = memo(function Contact() {
  // Memoize contact data to prevent recreating objects
  const contactData = useMemo(() => [
    {
      id: 1,
      title: "LinkedIn ↗",
      href: "https://www.linkedin.com/in/jesse-lee-619888284/",
      type: "link"
    },
    {
      id: 2,
      title: "GitHub ↗",
      href: "https://github.com/leehin6969",
      type: "link"
    },
    {
      id: 3,
      title: "Email ↗",
      href: "mailto:redmmo6969@gmail.com",
      type: "email"
    },
    {
      id: 4,
      title: "Resume↗",
      href: "/JESSELEE_Resume.pdf#zoom=50",
      type: "pdf"
    }
  ], []);

  return (
    <Section>
      <Content>
        <Title>Get In Touch</Title>
        <Text>Let's work together to create something amazing</Text>
        <ContactList>
          {contactData.map((contact) => (
            <ContactRow key={contact.id}>
              <ContactLink
                href={contact.href}
                target={contact.type === 'link' || contact.type === 'pdf' ? '_blank' : undefined}
                rel={contact.type === 'link' || contact.type === 'pdf' ? 'noopener noreferrer' : undefined}
              >
                <ContactTitle>{contact.title}</ContactTitle>
              </ContactLink>
            </ContactRow>
          ))}
        </ContactList>
      </Content>
    </Section>
  );
});

export default Contact; 