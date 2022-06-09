import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import Header from './Header';

const GlobalStyles = createGlobalStyle`
  html {
    --red: #ff0000;
    --black: #393939;
    --grey: #3a3a3a;
    --gray: var(--grey);
    --lightgrey: #e1e1e1;
    --lighgray: var(--lighgrey);
    --offwhite: #ededed;
    --maxWidth: 1000px;
    --bs: 0 12px 24px 0 rgba(0,0,0,0.99);
  }
`;

export default function Page({ children, cool }) {
  return (
    <div>
      <Header />
      <h2>I am a page component</h2>
      <h3>{cool}</h3>
      {children}
    </div>
  );
}

Page.propTypes = {
  cool: PropTypes.string,
  children: PropTypes.any,
};
