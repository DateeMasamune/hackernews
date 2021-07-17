import { render, screen } from '@testing-library/react';
import App from './App';
import renderer from 'react-test-renderer';
import { expect } from '@jest/globals';
import App, {Search, Button} from './App';

describe('App', () => {

  test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('есть корректный снимок', () => {
    const component = renderer.create(
      <App/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
});

describe('Search', () => {

  test('renders learn react link', () => {
    render(<Search />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('есть корректный снимок', () => {
    const component = renderer.create(
      <Search/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
});

describe('Button', () => {

  test('renders learn react link', () => {
    render(<Button />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('есть корректный снимок', () => {
    const component = renderer.create(
      <Button/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
});


