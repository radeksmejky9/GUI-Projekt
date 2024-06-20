import React from 'react';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import UserList from './components/UserList';

const App: React.FC = () => {
  return (
    <div className="App">
      <LoginForm />
      <SignUpForm />
      <UserList />
    </div>
  );
};

export default App;
