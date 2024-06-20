import React from 'react';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';

const App: React.FC = () => {
  return (
    <div className="App">
      <LoginForm />
      <SignUpForm />
    </div>
  );
};

export default App;
