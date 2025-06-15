import{r as m,j as e,n as t}from"./index-C7r6k0E_.js";const r=t.section`
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
`,o=t.div`
  max-width: 600px;
  width: 100%;
  text-align: right;

  @media (max-width: 768px) {
    max-width: 100%;
    text-align: center;
  }
`,d=t.h2`
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
`,s=t.p`
  font-size: 1.2rem;
  color: ${n=>n.theme==="dark"?"#aaaaaa":"#666666"};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`,l=t.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
  }
`,x=t.div`
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
`,h=t.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  transition: all 0.3s ease;

  &:hover {
    color: ${n=>n.theme==="dark"?"#aaaaaa":"#666666"};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`,p=t.a`
  color: inherit;
  text-decoration: none;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`,f=m.memo(function(){const a=m.useMemo(()=>[{id:1,title:"LinkedIn ↗",href:"https://www.linkedin.com/in/jesse-lee-619888284/",type:"link"},{id:2,title:"GitHub ↗",href:"https://github.com/leehin6969",type:"link"},{id:3,title:"Email ↗",href:"mailto:redmmo6969@gmail.com",type:"email"},{id:4,title:"Resume↗",href:"/src/lib/JESSELEE_Resume.pdf#zoom=50",type:"pdf"}],[]);return e.jsx(r,{children:e.jsxs(o,{children:[e.jsx(d,{children:"Get In Touch"}),e.jsx(s,{children:"Let's work together to create something amazing"}),e.jsx(l,{children:a.map(i=>e.jsx(x,{children:e.jsx(p,{href:i.href,target:i.type==="link"||i.type==="pdf"?"_blank":void 0,rel:i.type==="link"||i.type==="pdf"?"noopener noreferrer":void 0,children:e.jsx(h,{children:i.title})})},i.id))})]})})});export{f as default};
